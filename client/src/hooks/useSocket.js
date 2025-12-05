import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  addMessage,
  updateMessageStatus,
  markMessagesAsRead,
  setTyping,
} from '../store/slices/messageSlice';
import { updateChatLastMessage } from '../store/slices/chatSlice';
import { updateUserOnlineStatus } from '../store/slices/chatSlice';

/**
 * Custom Hook: useSocket
 * 
 * Manages Socket.io connection and real-time events
 * 
 * Why useRef:
 * - Stores socket instance that persists across renders
 * - Prevents socket reconnection on every render
 * - Allows access to current socket instance in callbacks
 * 
 * Why useCallback:
 * - Memoizes socket event handlers
 * - Prevents unnecessary re-subscriptions
 * - Ensures stable function references
 */
export const useSocket = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  /**
   * Initialize socket connection
   * Only connects if user is authenticated
   */
  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    // Create socket connection with authentication
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Connection event
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    // New message event
    socket.on('new-message', (data) => {
      const { message } = data;
      dispatch(
        addMessage({
          chatId: message.chatId,
          message,
        })
      );
      dispatch(
        updateChatLastMessage({
          chatId: message.chatId,
          lastMessage: message,
        })
      );
    });

    // Message sent confirmation
    socket.on('message-sent', (data) => {
      const { message } = data;
      dispatch(
        addMessage({
          chatId: message.chatId,
          message,
        })
      );
    });

    // Messages read event
    socket.on('messages-read', (data) => {
      const { chatId, messageIds } = data;
      dispatch(
        markMessagesAsRead({
          chatId,
          messageIds,
        })
      );
    });

    // User typing event
    socket.on('user-typing', (data) => {
      const { chatId, userId, isTyping } = data;
      dispatch(
        setTyping({
          chatId,
          userId,
          isTyping,
        })
      );
    });

    // User online event
    socket.on('user-online', (data) => {
      dispatch(
        updateUserOnlineStatus({
          userId: data.userId,
          isOnline: true,
        })
      );
    });

    // User offline event
    socket.on('user-offline', (data) => {
      dispatch(
        updateUserOnlineStatus({
          userId: data.userId,
          isOnline: false,
        })
      );
    });

    // Error event
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [token, user, dispatch]);

  /**
   * Send message via socket
   * Memoized to prevent recreation
   */
  const sendMessage = useCallback(
    (messageData) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send-message', messageData);
      }
    },
    []
  );

  /**
   * Emit typing indicator
   * Memoized to prevent recreation
   */
  const emitTyping = useCallback((chatId, receiverId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', { chatId, receiverId });
    }
  }, []);

  /**
   * Emit stop typing
   * Memoized to prevent recreation
   */
  const emitStopTyping = useCallback((chatId, receiverId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('stop-typing', { chatId, receiverId });
    }
  }, []);

  /**
   * Mark messages as read via socket
   * Memoized to prevent recreation
   */
  const markAsRead = useCallback((chatId, messageIds) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mark-read', { chatId, messageIds });
    }
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markAsRead,
    isConnected: socketRef.current?.connected || false,
  };
};

