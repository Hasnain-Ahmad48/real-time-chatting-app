<!-- # Socket.io Events Documentation

## Connection

### Authentication
Socket connections require JWT token authentication:
```javascript
const socket = io(SOCKET_URL, {
  auth: {
    token: 'jwt_token_here'
  }
});
```

## Client → Server Events

### send-message
Send a new message to a user.

**Event**: `send-message`

**Payload**:
```javascript
{
  chatId: "chat_id",
  receiverId: "user_id",
  text: "Message text",
  mediaURL: "https://cloudinary.com/image.jpg", // optional
  mediaType: "image" // optional: "image", "video", "file"
}
```

**Server Response**: Emits `message-sent` event to sender

### typing
Emit typing indicator to receiver.

**Event**: `typing`

**Payload**:
```javascript
{
  chatId: "chat_id",
  receiverId: "user_id"
}
```

**Server Response**: Emits `user-typing` event to receiver with `isTyping: true`

### stop-typing
Stop typing indicator.

**Event**: `stop-typing`

**Payload**:
```javascript
{
  chatId: "chat_id",
  receiverId: "user_id"
}
```

**Server Response**: Emits `user-typing` event to receiver with `isTyping: false`

### mark-read
Mark messages as read.

**Event**: `mark-read`

**Payload**:
```javascript
{
  chatId: "chat_id",
  messageIds: ["message_id1", "message_id2"]
}
```

**Server Response**: Emits `messages-read` event to sender

## Server → Client Events

### connect
Emitted when socket successfully connects.

**Event**: `connect`

**No Payload**

### connect_error
Emitted when connection fails.

**Event**: `connect_error`

**Payload**: Error object

### new-message
Emitted when a new message is received.

**Event**: `new-message`

**Payload**:
```javascript
{
  message: {
    _id: "message_id",
    chatId: "chat_id",
    senderId: {
      _id: "user_id",
      name: "John Doe",
      avatar: ""
    },
    receiverId: "user_id",
    text: "Hello!",
    mediaURL: "",
    mediaType: "",
    status: "delivered", // or "sent", "read"
    readAt: null,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
}
```

### message-sent
Confirmation that message was sent (optimistic UI).

**Event**: `message-sent`

**Payload**:
```javascript
{
  message: {
    _id: "message_id",
    chatId: "chat_id",
    senderId: {
      _id: "user_id",
      name: "John Doe",
      avatar: ""
    },
    receiverId: "user_id",
    text: "Hello!",
    status: "sent",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
}
```

### message-error
Emitted when message sending fails.

**Event**: `message-error`

**Payload**:
```javascript
{
  error: "Failed to send message"
}
```

### user-typing
Emitted when a user is typing.

**Event**: `user-typing`

**Payload**:
```javascript
{
  chatId: "chat_id",
  userId: "user_id",
  isTyping: true // or false
}
```

### user-online
Emitted when a user comes online.

**Event**: `user-online`

**Payload**:
```javascript
{
  userId: "user_id"
}
```

### user-offline
Emitted when a user goes offline.

**Event**: `user-offline`

**Payload**:
```javascript
{
  userId: "user_id"
}
```

### messages-read
Emitted when messages are read by receiver.

**Event**: `messages-read`

**Payload**:
```javascript
{
  chatId: "chat_id",
  messageIds: ["message_id1", "message_id2"]
}
```

## Example Usage

### Client Side (React)

```javascript
import { useEffect } from 'react';
import { useSocket } from './hooks/useSocket';

function ChatComponent() {
  const { socket, sendMessage, emitTyping, emitStopTyping } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new-message', (data) => {
      console.log('New message:', data.message);
      // Update UI with new message
    });

    // Listen for typing indicators
    socket.on('user-typing', (data) => {
      console.log('User typing:', data.userId, data.isTyping);
      // Show/hide typing indicator
    });

    // Listen for online status
    socket.on('user-online', (data) => {
      console.log('User online:', data.userId);
      // Update user status
    });

    socket.on('user-offline', (data) => {
      console.log('User offline:', data.userId);
      // Update user status
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, [socket]);

  const handleSendMessage = () => {
    sendMessage({
      chatId: 'chat_id',
      receiverId: 'user_id',
      text: 'Hello!'
    });
  };

  const handleTyping = () => {
    emitTyping('chat_id', 'user_id');
  };

  return (
    // Your component JSX
  );
}
```

## Connection States

- **Connecting**: Socket is attempting to connect
- **Connected**: Socket is connected and authenticated
- **Disconnected**: Socket is disconnected
- **Error**: Connection error occurred

## Best Practices

1. **Reconnection**: Socket.io automatically handles reconnection. Listen to `connect` event to resubscribe to rooms.

2. **Error Handling**: Always listen to `connect_error` and handle authentication failures.

3. **Cleanup**: Remove event listeners in `useEffect` cleanup to prevent memory leaks.

4. **Typing Indicators**: Use debouncing for typing events to avoid excessive emissions.

5. **Message Status**: Update message status optimistically, then sync with server events.
 -->



