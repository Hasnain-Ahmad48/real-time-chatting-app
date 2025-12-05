# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": ""
    },
    "token": "jwt_token_here"
  }
}
```

### Login
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "isOnline": true
    },
    "token": "jwt_token_here"
  }
}
```

### Get Current User
- **GET** `/auth/me`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "",
      "isOnline": true,
      "lastSeen": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Logout
- **POST** `/auth/logout`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Endpoints

### Search Users
- **GET** `/users/search?q=searchterm`
- **Access**: Private
- **Query Parameters**:
  - `q`: Search query (name or email)
- **Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "avatar": "",
        "isOnline": true,
        "lastSeen": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Get User Chats
- **GET** `/users/chats`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "_id": "chat_id",
        "user": {
          "_id": "user_id",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "avatar": "",
          "isOnline": true,
          "lastSeen": "2024-01-01T00:00:00.000Z"
        },
        "lastMessage": {
          "_id": "message_id",
          "text": "Hello!",
          "senderId": "user_id",
          "status": "read",
          "createdAt": "2024-01-01T00:00:00.000Z"
        },
        "lastMessageAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Get User by ID
- **GET** `/users/:userId`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "avatar": "",
      "isOnline": true,
      "lastSeen": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Update Profile
- **PUT** `/users/profile`
- **Access**: Private
- **Body**:
```json
{
  "name": "John Updated",
  "avatar": "https://cloudinary.com/image.jpg"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Updated",
      "email": "john@example.com",
      "avatar": "https://cloudinary.com/image.jpg",
      "isOnline": true,
      "lastSeen": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Chat Endpoints

### Get or Create Chat
- **GET** `/chats/:userId`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "chat": {
      "_id": "chat_id",
      "participants": [
        {
          "_id": "user1_id",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "",
          "isOnline": true
        },
        {
          "_id": "user2_id",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "avatar": "",
          "isOnline": false
        }
      ],
      "lastMessage": null,
      "lastMessageAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Messages
- **GET** `/chats/:chatId/messages?page=1&limit=20`
- **Access**: Private
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Messages per page (default: 20)
- **Response**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "message_id",
        "chatId": "chat_id",
        "senderId": {
          "_id": "user_id",
          "name": "John Doe",
          "avatar": ""
        },
        "receiverId": "user_id",
        "text": "Hello!",
        "mediaURL": "",
        "mediaType": "",
        "status": "read",
        "readAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### Mark Messages as Read
- **PUT** `/chats/:chatId/messages/read`
- **Access**: Private
- **Response**:
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

## Message Endpoints

### Send Message
- **POST** `/messages`
- **Access**: Private
- **Body**:
```json
{
  "chatId": "chat_id",
  "receiverId": "user_id",
  "text": "Hello!",
  "mediaURL": "",
  "mediaType": ""
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": {
      "_id": "message_id",
      "chatId": "chat_id",
      "senderId": {
        "_id": "user_id",
        "name": "John Doe",
        "avatar": ""
      },
      "receiverId": "user_id",
      "text": "Hello!",
      "mediaURL": "",
      "mediaType": "",
      "status": "sent",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Upload Endpoints

### Upload Image
- **POST** `/upload/image`
- **Access**: Private
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `image` field
- **Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "chat-app/image_id"
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `500`: Internal Server Error




