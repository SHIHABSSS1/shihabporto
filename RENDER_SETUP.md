# Render Deployment Guide

This guide will help you deploy your portfolio on Render.com using MongoDB Atlas as the database.

## 1. MongoDB Atlas Setup (Already Completed)

Your MongoDB Atlas database is already set up with the following details:
- **Connection String**: `mongodb+srv://shihabsss1:shihabport1212@portfolio.v6uidbr.mongodb.net/portfolio`
- **Database Name**: `portfolio`

## 2. Render Setup

### Step 1: Create a Render Account
- Go to [Render](https://render.com/) and sign up for an account if you don't have one already

### Step 2: Connect Your GitHub Repository
- Click "New" and select "Web Service"
- Connect your GitHub account (if not already connected)
- Select your portfolio repository

### Step 3: Configure Your Web Service
- **Name**: `shihabporto` (or your preferred name)
- **Region**: Choose the region closest to your target audience
- **Branch**: `main` (or your main branch)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free (for testing) or Basic (for production)

### Step 4: Add Environment Variables
- In the "Environment" section, add the following variables:
  ```
  MONGODB_URI=mongodb+srv://shihabsss1:shihabport1212@portfolio.v6uidbr.mongodb.net/portfolio
  MONGODB_DB=portfolio
  ADMIN_PASSWORD=shihab123
  NODE_ENV=production
  ```

### Step 5: Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your application
- Once deployment is complete, you can access your site at the provided URL

## 3. Setting Up a Custom Domain (Optional)

If you want to use a custom domain:
1. Go to the "Settings" tab of your web service
2. Click on "Custom Domain"
3. Enter your domain name
4. Follow the instructions to update your DNS records

## 4. Troubleshooting

- If you encounter build errors, check the build logs in Render
- If you have database connection issues, verify your MongoDB URI is correct
- For any other issues, check the Render documentation or contact their support 