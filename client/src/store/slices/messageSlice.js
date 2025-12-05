import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chatService';

/**
 * Async thunk to fetch messages
 */
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async ({ chatId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(chatId, page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

const initialState = {
  messages: {},
  typingUsers: {},
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    /**
     * Add a new message (optimistic UI)
     * Used for real-time message updates
     */
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }

      // Normalize IDs to strings for reliable comparison
      const incomingId = message._id ? message._id.toString() : null;
      const incomingClientId = message.clientId || null;

      const existingIndex = state.messages[chatId].findIndex((m) => {
        const mid = m._id ? m._id.toString() : null;
        const mClientId = m.clientId || null;
        return (incomingId && mid === incomingId) || (incomingClientId && mClientId === incomingClientId);
      });

      if (existingIndex !== -1) {
        // Merge/update existing (replace optimistic with server copy)
        state.messages[chatId][existingIndex] = {
          ...state.messages[chatId][existingIndex],
          ...message,
        };
      } else {
        state.messages[chatId].push(message);
      }
    },
    /**
     * Set messages for a chat
     * Used when loading message history
     */
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    /**
     * Update message status (sent -> delivered -> read)
     */
    updateMessageStatus: (state, action) => {
      const { chatId, messageId, status } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find((m) => m._id === messageId);
        if (message) {
          message.status = status;
          if (status === 'read') {
            message.readAt = new Date();
          }
        }
      }
    },
    /**
     * Mark messages as read
     */
    markMessagesAsRead: (state, action) => {
      const { chatId, messageIds } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId].forEach((message) => {
          if (messageIds.includes(message._id)) {
            message.status = 'read';
            message.readAt = new Date();
          }
        });
      }
    },
    /**
     * Set typing indicator
     */
    setTyping: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = {};
      }
      if (isTyping) {
        state.typingUsers[chatId][userId] = true;
      } else {
        delete state.typingUsers[chatId][userId];
      }
    },
    /**
     * Clear messages for a chat
     */
    clearMessages: (state, action) => {
      const chatId = action.payload;
      delete state.messages[chatId];
      delete state.typingUsers[chatId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { messages, pagination } = action.payload;
        const chatId = action.meta.arg.chatId;

        if (pagination.page === 1) {
          // First page - replace messages
          state.messages[chatId] = messages;
        } else {
          // Subsequent pages - prepend messages
          state.messages[chatId] = [...messages, ...(state.messages[chatId] || [])];
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  setMessages,
  updateMessageStatus,
  markMessagesAsRead,
  setTyping,
  clearMessages,
} = messageSlice.actions;
export default messageSlice.reducer;

