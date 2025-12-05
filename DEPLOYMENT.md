# Deployment Guide

This guide covers deploying the chat application to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account
- Hosting accounts (Render/Netlify/Vercel)

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS - Update with your frontend URL
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Backend Deployment (Render)

### Step 1: Prepare Repository

1. Push your code to GitHub
2. Ensure `server/package.json` has a `start` script

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `chat-app-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables (from .env above)
6. Click "Create Web Service"

### Step 3: Configure MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get connection string and add to `MONGODB_URI`

### Step 4: Socket.io Configuration

Render supports WebSockets. Ensure your service is set to:
- **Auto-Deploy**: Yes
- **Health Check Path**: `/health`

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to client directory:
```bash
cd client
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - `VITE_API_URL`
   - `VITE_SOCKET_URL`

5. Update backend `CLIENT_URL` with Vercel domain

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Navigate to client directory:
```bash
cd client
```

3. Build:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod --dir=dist
```

5. Add environment variables in Netlify dashboard

## Alternative: Full Stack Deployment

### Render (Full Stack)

1. Deploy backend as Web Service (see above)
2. Deploy frontend as Static Site:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `client/dist`

### Railway

1. Create account at [Railway](https://railway.app)
2. Deploy backend:
   - Connect GitHub repo
   - Set root directory to `server`
   - Add environment variables
3. Deploy frontend:
   - Create new service
   - Set root directory to `client`
   - Add environment variables

## Post-Deployment Checklist

- [ ] Backend is accessible at production URL
- [ ] Frontend is accessible at production URL
- [ ] MongoDB connection is working
- [ ] Socket.io connections are working (check browser console)
- [ ] Image uploads to Cloudinary are working
- [ ] Authentication is working
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] HTTPS is enabled (required for WebSockets in production)

## Socket.io Deployment Considerations

### Important Notes:

1. **Sticky Sessions**: If using multiple server instances, enable sticky sessions:
   ```javascript
   // In server.js
   const io = new Server(httpServer, {
     adapter: createAdapter(),
     // ... other options
   });
   ```

2. **CORS Configuration**: Ensure CORS allows your frontend domain:
   ```javascript
   cors: {
     origin: process.env.CLIENT_URL,
     credentials: true
   }
   ```

3. **Health Checks**: Add health check endpoint:
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'OK' });
   });
   ```

4. **WebSocket Upgrade**: Ensure your hosting provider supports WebSocket upgrades (Render, Railway, and Heroku do).

## Troubleshooting

### Socket Connection Issues

1. **Check CORS settings**: Ensure frontend URL is in allowed origins
2. **Check authentication**: Verify JWT token is being sent
3. **Check network**: Ensure WebSocket connections aren't blocked
4. **Check logs**: Review server logs for connection errors

### Database Connection Issues

1. **Check MongoDB URI**: Ensure connection string is correct
2. **Check IP whitelist**: Ensure server IP is whitelisted in MongoDB Atlas
3. **Check credentials**: Verify database username and password

### Image Upload Issues

1. **Check Cloudinary credentials**: Verify API keys are correct
2. **Check file size limits**: Ensure files are under 5MB
3. **Check CORS**: Ensure Cloudinary allows your domain

## Monitoring

### Recommended Tools:

1. **Application Monitoring**: 
   - [Sentry](https://sentry.io) for error tracking
   - [LogRocket](https://logrocket.com) for session replay

2. **Performance Monitoring**:
   - [New Relic](https://newrelic.com)
   - [Datadog](https://www.datadoghq.com)

3. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com)
   - [Pingdom](https://www.pingdom.com)

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] MongoDB connection uses authentication
- [ ] CORS is restricted to frontend domain only
- [ ] Rate limiting is enabled
- [ ] Helmet.js is configured
- [ ] Input validation is enabled
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed
- [ ] Password hashing is using bcrypt
- [ ] File upload size limits are set

## Scaling Considerations

1. **Database**: Use MongoDB Atlas with appropriate cluster size
2. **Socket.io**: Use Redis adapter for multiple instances
3. **CDN**: Use Cloudinary CDN for image delivery
4. **Caching**: Consider Redis for session management
5. **Load Balancing**: Use multiple server instances with sticky sessions

## Cost Estimation

### Free Tier Options:
- **Render**: Free tier available (with limitations)
- **Vercel**: Free tier for frontend
- **MongoDB Atlas**: Free tier (512MB)
- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)

### Paid Options (as needed):
- **Render**: $7/month per service
- **MongoDB Atlas**: $9/month (M10 cluster)
- **Cloudinary**: Pay-as-you-go after free tier

## Support

For issues or questions:
1. Check server logs
2. Check browser console
3. Review API documentation
4. Check Socket.io connection status




