# Architecture Documentation

## Overview

This document explains the architecture decisions, React patterns, and design choices made in the application.

## React Patterns Explained

### useCallback

**Purpose**: Memoizes functions to prevent unnecessary re-renders.

**Why Used**:
- When passing functions as props to memoized components (React.memo)
- To maintain stable function references across renders
- To prevent infinite loops in useEffect dependencies

**Examples in Code**:
1. **useAuth.js**: Login, register, logout functions are memoized to prevent recreation on every render
2. **useSocket.js**: Socket event handlers are memoized to prevent re-subscriptions
3. **MessageInput.jsx**: Event handlers are memoized to prevent child re-renders

**Code Example**:
```javascript
const handleSend = useCallback(
  async (messageText) => {
    // Function logic
  },
  [chatId, receiverId, sendMessage] // Dependencies
);
```

### useRef

**Purpose**: Stores mutable values that don't trigger re-renders when changed.

**Why Used**:
- To store DOM element references
- To store values that persist across renders but don't need to trigger updates
- To avoid recreating objects/functions on every render

**Examples in Code**:
1. **useSocket.js**: Stores socket instance (`socketRef`) - socket connection persists across renders
2. **MessageInput.jsx**: Stores file input reference (`fileInputRef`) - allows programmatic file selection
3. **MessageList.jsx**: Stores scroll container reference (`messagesEndRef`) - enables auto-scroll
4. **MessageInput.jsx**: Stores typing timeout reference (`typingTimeoutRef`) - manages typing indicator debounce

**Code Example**:
```javascript
const socketRef = useRef(null);

useEffect(() => {
  socketRef.current = io(SOCKET_URL);
  // socketRef persists across renders
}, []);
```

### useMemo

**Purpose**: Memoizes expensive calculations to avoid recalculation on every render.

**Why Used**:
- To optimize performance for expensive computations
- To prevent unnecessary recalculations when dependencies haven't changed
- To maintain referential equality for objects/arrays passed as props

**Examples in Code**:
1. **ChatList.jsx**: Sorts chats array only when chats change (`sortedChats`)
2. **useMessages.js**: Memoizes filtered messages for current chat (`chatMessages`)
3. **MessageList.jsx**: Memoizes current user ID to avoid recalculation
4. **UserSearch.jsx**: Memoizes debounced search function

**Code Example**:
```javascript
const sortedChats = useMemo(() => {
  return [...chats].sort((a, b) => {
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });
}, [chats]); // Only recalculates when chats changes
```

### React.memo

**Purpose**: Prevents component re-renders when props haven't changed.

**Why Used**:
- For frequently rendered components (like in lists)
- To improve performance by avoiding unnecessary renders
- When parent re-renders but child props are unchanged

**Examples in Code**:
1. **Avatar.jsx**: Rendered in chat lists - prevents re-render when other chats update
2. **MessageBubble.jsx**: Rendered in message lists - prevents re-render when other messages change
3. **TypingIndicator.jsx**: Rendered frequently during typing - prevents unnecessary renders

**Code Example**:
```javascript
const Avatar = React.memo(({ user, size }) => {
  // Component only re-renders if user or size props change
  return <div>...</div>;
});
```

## State Management: Redux Toolkit

**Why Redux Toolkit was chosen over Context API**:

1. **Performance**: Redux uses shallow equality checks, preventing unnecessary re-renders
2. **DevTools**: Excellent debugging with Redux DevTools
3. **Scalability**: Better for complex state management as app grows
4. **Middleware**: Built-in support for async operations (createAsyncThunk)
5. **Predictability**: Centralized state with clear update patterns
6. **Time-travel debugging**: Can replay actions for debugging

**Alternative Consideration**: Context API could work for smaller apps, but Redux Toolkit provides better performance and developer experience for this scale.

## Folder Structure

### Backend (MVC Pattern)

```
server/
├── config/          # Configuration (database, cloudinary)
├── controllers/     # Business logic (MVC: Controller)
├── middleware/      # Auth, validation, error handling
├── models/          # Database schemas (MVC: Model)
├── routes/          # API endpoints (MVC: View/Routes)
├── socket/          # Socket.io event handlers
└── server.js        # Entry point
```

**Why MVC**:
- Separation of concerns
- Easier to test and maintain
- Clear responsibility boundaries
- Industry standard pattern

### Frontend

```
client/src/
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── services/       # API service layer
├── store/          # Redux store and slices
└── utils/          # Utility functions
```

**Why This Structure**:
- Clear separation of concerns
- Easy to locate files
- Scalable as app grows
- Follows React best practices

## Custom Hooks

### useAuth
- Centralizes authentication logic
- Provides consistent auth API across components
- Memoizes functions to prevent re-renders

### useSocket
- Manages Socket.io connection lifecycle
- Handles all socket events in one place
- Provides clean API for components

### useMessages
- Encapsulates message management for a chat
- Handles loading, sending, and status updates
- Memoizes expensive operations

## Security Architecture

### Authentication Flow

1. **Registration/Login**: User credentials → Server validates → JWT token generated
2. **Token Storage**: JWT stored in localStorage (consider httpOnly cookies for production)
3. **API Requests**: Token sent in Authorization header
4. **Socket Connection**: Token sent in auth object during connection
5. **Token Validation**: Middleware validates token on every request

### Protected Routes

- **API Routes**: `protect` middleware validates JWT
- **Socket Connections**: `socketAuth` middleware validates JWT
- **Frontend Routes**: `ProtectedRoute` component checks authentication

### Input Validation

- **Backend**: express-validator for all inputs
- **Frontend**: React Hook Form with validation rules
- **Sanitization**: Automatic with express-validator

## Real-time Architecture

### Socket.io Implementation

1. **Connection**: Client connects with JWT token
2. **Authentication**: Server validates token before accepting connection
3. **Room Management**: Each user joins their personal room (`user:userId`)
4. **Event Handling**: Server handles events and broadcasts to appropriate clients
5. **Status Updates**: Online/offline status updated in database and broadcasted

### Message Flow

1. **Send**: Client emits `send-message` event
2. **Store**: Server saves message to database
3. **Broadcast**: Server emits `new-message` to receiver (if online)
4. **Status**: Message status updated (sent → delivered → read)
5. **Confirmation**: Server emits `message-sent` to sender

### Optimistic UI

- Messages appear immediately in sender's UI
- Status updates as server confirms
- Failed messages can be retried
- Provides instant feedback

## Database Schema

### User Model
- Authentication fields (email, password)
- Profile fields (name, avatar)
- Status fields (isOnline, lastSeen)

### Chat Model
- Participants array (2 users for 1-to-1)
- Last message reference
- Timestamps

### Message Model
- Chat reference
- Sender/Receiver IDs
- Content (text, media)
- Status (sent, delivered, read)
- Timestamps

## Performance Optimizations

1. **Memoization**: useCallback, useMemo, React.memo prevent unnecessary renders
2. **Pagination**: Messages loaded in batches (20 per page)
3. **Indexing**: MongoDB indexes on frequently queried fields
4. **Lazy Loading**: Components loaded on demand
5. **Image Optimization**: Cloudinary transformations for optimized images

## Error Handling

### Backend
- Centralized error handler middleware
- Consistent error response format
- Error logging for debugging

### Frontend
- Try-catch blocks for async operations
- Error boundaries for React errors
- User-friendly error messages
- Retry mechanisms for failed requests

## Testing Considerations

While not implemented, recommended testing:

1. **Unit Tests**: Components, hooks, utilities
2. **Integration Tests**: API endpoints, socket events
3. **E2E Tests**: User flows (login, send message, etc.)

## Future Enhancements

1. **Message Reactions**: Add emoji reactions
2. **File Sharing**: Support for documents
3. **Group Chats**: Extend to group conversations
4. **Voice/Video**: WebRTC integration
5. **Notifications**: Push notifications
6. **Message Search**: Full-text search
7. **Read Receipts**: Detailed read status
8. **Message Editing**: Edit sent messages
9. **Message Deletion**: Delete messages
10. **Dark Mode**: Theme support




