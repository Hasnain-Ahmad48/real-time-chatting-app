import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, clearMessages, addMessage } from '../store/slices/messageSlice';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

/**
 * Custom Hook: useMessages
 * 
 * Manages messages for a specific chat
 * 
 * Why useMemo:
 * - Memoizes filtered/sorted messages to avoid recalculation
 * - Only recalculates when messages or chatId changes
 * - Improves performance for large message lists
 * 
 * Why useCallback:
 * - Memoizes functions to prevent unnecessary re-renders
 * - Stable function references for child components
 */
export const useMessages = (chatId) => {
  const dispatch = useDispatch();
  const { messages, typingUsers, loading } = useSelector(
    (state) => state.message
  );
  const { user } = useSelector((state) => state.auth);
  const { sendMessage, emitTyping, emitStopTyping, markAsRead } = useSocket();

  // Get messages for current chat
  const chatMessages = useMemo(() => {
    return messages[chatId] || [];
  }, [messages, chatId]);

  // Get typing users for current chat
  const typingUsersList = useMemo(() => {
    return typingUsers[chatId] || {};
  }, [typingUsers, chatId]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages({ chatId, page: 1, limit: 20 }));
    }

    // Cleanup: clear messages when chat changes
    return () => {
      // Optionally clear messages when leaving chat
      // dispatch(clearMessages(chatId));
    };
  }, [chatId, dispatch]);

  // Memoized function to send message
  const handleSendMessage = useCallback(
    (messageData) => {
      // Generate clientId for optimistic UI + dedup
      const clientId = `${chatId || 'chat'}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      // Optimistic add
      dispatch(
        addMessage({
          chatId,
          message: {
            _id: clientId, // temp id for rendering
            clientId,
            chatId,
            receiverId: messageData.receiverId,
            senderId: {
              _id: user?._id,
              name: user?.name,
              avatar: user?.avatar,
            },
            text: messageData.text,
            mediaURL: messageData.mediaURL || '',
            mediaType: messageData.mediaType || '',
            status: 'sending',
            createdAt: new Date().toISOString(),
          },
        })
      );

      // Emit via socket
      sendMessage({
        ...messageData,
        chatId,
        clientId,
      });
    },
    [chatId, sendMessage, dispatch, user]
  );

  // Memoized function to handle typing
  const handleTyping = useCallback(
    (receiverId) => {
      emitTyping(chatId, receiverId);
    },
    [chatId, emitTyping]
  );

  // Memoized function to handle stop typing
  const handleStopTyping = useCallback(
    (receiverId) => {
      emitStopTyping(chatId, receiverId);
    },
    [chatId, emitStopTyping]
  );

  // Memoized function to mark messages as read
  const handleMarkAsRead = useCallback(
    (messageIds) => {
      markAsRead(chatId, messageIds);
    },
    [chatId, markAsRead]
  );

  return {
    messages: chatMessages,
    typingUsers: typingUsersList,
    loading,
    sendMessage: handleSendMessage,
    handleTyping,
    handleStopTyping,
    handleMarkAsRead,
  };
};

