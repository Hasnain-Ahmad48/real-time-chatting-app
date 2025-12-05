# Real-time 1-to-1 Messaging Application

A production-ready real-time messaging application built with React, Node.js, Express, MongoDB, Socket.io, Redux Toolkit, and Cloudinary.

## 🚀 Features

- **Authentication**: JWT-based signup/login with password hashing
- **Real-time Messaging**: Instant 1-to-1 messaging via Socket.io
- **Online/Offline Status**: Real-time user presence indicators
- **Typing Indicators**: See when users are typing
- **Message Status**: Sent, Delivered, and Read receipts
- **Image Uploads**: Cloudinary integration for media sharing
- **User Search**: Find and start conversations with users
- **Responsive Design**: Works on mobile and desktop
- **Optimistic UI**: Instant message delivery feedback

## 📁 Project Structure

```
chatapplication/
├── server/                 # Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── socket/            # Socket.io handlers
│   └── server.js         # Entry point
│
└── client/                # Frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # Redux store and slices
    │   └── utils/         # Utility functions
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Socket.io Client** for real-time communication
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for WebSocket connections
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image uploads
- **Express Validator** for input validation

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Search Users**: Use the search bar to find users
3. **Start Chat**: Click on a user to start a conversation
4. **Send Messages**: Type and send messages in real-time
5. **Upload Images**: Click the image icon to share photos
6. **See Status**: View message delivery and read status

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🔌 Socket Events

See [SOCKET_EVENTS.md](./SOCKET_EVENTS.md) for Socket.io event documentation.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## 🧩 React Patterns Used

### useCallback
Used to memoize functions and prevent unnecessary re-renders. Examples:
- Event handlers in `MessageInput`
- Socket event handlers in `useSocket`
- Search handlers in `UserSearch`

### useRef
Used to store mutable values that don't trigger re-renders. Examples:
- Socket instance in `useSocket`
- File input reference in `MessageInput`
- Scroll container reference in `MessageList`

### useMemo
Used to memoize expensive calculations. Examples:
- Sorted chat list in `ChatList`
- Filtered messages in `useMessages`
- Current user ID in `MessageList`

### React.memo
Used to prevent re-renders of components when props haven't changed. Examples:
- `Avatar` component
- `MessageBubble` component
- `TypingIndicator` component

### Custom Hooks
Created reusable hooks for:
- `useAuth`: Authentication state and methods
- `useSocket`: Socket.io connection management
- `useMessages`: Message management for a chat

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Protected Socket connections
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Rate limiting

## 📝 License

MIT




