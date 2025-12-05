import React, { useState, useRef, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { uploadService } from '../services/uploadService';

/**
 * MessageInput Component
 * Handles message input with typing indicators and image upload
 * 
 * Why useRef:
 * - Stores reference to file input element
 * - Allows programmatic file input trigger
 * - Doesn't cause re-renders when ref changes
 * 
 * Why useCallback:
 * - Memoizes event handlers
 * - Prevents unnecessary re-renders of parent
 * - Stable function references
 */
const MessageInput = ({
  chatId,
  receiverId,
  onSendMessage,
  onTyping,
  onStopTyping,
}) => {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage } = useSocket();

  // Handle text change with typing indicator
  const handleTextChange = useCallback(
    (e) => {
      setText(e.target.value);

      // Emit typing indicator
      if (onTyping) {
        onTyping();
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 1000);
    },
    [onTyping, onStopTyping]
  );

  // Handle send message
  const handleSend = useCallback(
    async (messageText, mediaURL = '', mediaType = '') => {
      if (!messageText.trim() && !mediaURL) return;

      const messageData = {
        chatId,
        receiverId,
        text: messageText,
        mediaURL,
        mediaType,
      };

      // Send via socket for real-time delivery
      sendMessage(messageData);

      // Also call callback if provided (for optimistic UI)
      if (onSendMessage) {
        onSendMessage(messageData);
      }

      setText('');
    },
    [chatId, receiverId, sendMessage, onSendMessage]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSend(text);
    },
    [text, handleSend]
  );

  // Handle image upload
  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const response = await uploadService.uploadImage(file);
        await handleSend('', response.data.url, 'image');
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [handleSend]
  );

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 text-gray-600 hover:text-primary-500 disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={!text.trim() && !uploading}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

