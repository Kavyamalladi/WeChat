# Vercel Deployment Guide

This guide will help you deploy the MERN Stack Chat Application to Vercel.

## Prerequisites
- Vercel account
- MongoDB Atlas account (for production database)
- GitHub repository

## Environment Variables
Set these in your Vercel dashboard:
- `MONGODB_URL`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: production

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will automatically detect the `vercel.json` configuration
5. Set environment variables in Vercel dashboard
6. Deploy!

## Features
- ✅ Real-time chat with Socket.io
- ✅ Voice and video calling
- ✅ Voice message recording
- ✅ Emoji support
- ✅ Online/offline status
- ✅ File attachments
- ✅ Theme customization
- ✅ Responsive design

## Build Optimization
- Code splitting for better performance
- Optimized chunks (vendor, router, ui)
- Source maps disabled in production
- Gzip compression enabled

## Troubleshooting
- Ensure MongoDB Atlas allows access from anywhere
- Check environment variables are set correctly
- Verify API routes work in production
