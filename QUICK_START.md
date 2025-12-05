# Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Cloudinary account (free tier works)

## Step 1: Clone and Setup

```bash
# Navigate to project directory
cd chatapplication
```

## Step 2: Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

Backend should be running on `http://localhost:5000`

## Step 3: Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

Frontend should be running on `http://localhost:5173`

## Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. Register a new account
3. Open another browser/incognito window
4. Register another account
5. Search for the first user
6. Start chatting!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist and credentials

### Socket Connection Error
- Check browser console for errors
- Verify `VITE_SOCKET_URL` matches backend URL
- Ensure backend is running

### Image Upload Not Working
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Check browser console for errors

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check that both servers are running

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for architecture explanation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **Redux DevTools**: Install browser extension for state debugging
3. **MongoDB Compass**: Use for database inspection
4. **Socket.io Debug**: Enable in browser console for socket debugging

## Common Commands

### Backend
```bash
npm run dev    # Start development server
npm start      # Start production server
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

