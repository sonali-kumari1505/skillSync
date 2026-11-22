# SkillSync Deployment Guide

This guide walks you through deploying **SkillSync** across cloud platforms:
- **Database**: MongoDB Atlas (Free Shared Tier)
- **Backend API & WebSockets**: Render Web Service (Node.js)
- **AI Recommendation Engine**: Render Web Service (Python FastAPI)
- **Frontend Web App**: Vercel (React + Vite)

---

## 1. MongoDB Atlas Configuration

1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster** (Shared Tier).
3. **Database Access**:
   - Create a database user (e.g., `skillsync_user`) with password authentication.
   - Assign the **Read and write to any database** privilege.
4. **Network Access**:
   - Add an IP access entry: `0.0.0.0/0` (Allow access from anywhere) so cloud servers on Render can connect.
5. **Get Connection String**:
   - Go to your Cluster -> **Connect** -> **Drivers** (Node.js).
   - Copy connection string:
     ```text
     mongodb+srv://skillsync_user:<password>@cluster0.mongodb.net/skillsync?retryWrites=true&w=majority
     ```

---

## 2. Deploy AI Recommendation Engine on Render

1. Log into [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your Git repository.
4. Set root directory to `ai-engine`.
5. Configuration:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Click **Deploy**. Note your service URL (e.g. `https://skillsync-ai.onrender.com`).

---

## 3. Deploy Backend API on Render

1. On Render, click **New +** -> **Web Service**.
2. Connect your Git repository and set root directory to `backend`.
3. Configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<generate random secret string>`
   - `JWT_EXPIRE`: `30d`
   - `AI_SERVICE_URL`: `<URL of the deployed AI engine, e.g. https://skillsync-ai.onrender.com>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
5. Click **Deploy**. Note your backend URL (e.g. `https://skillsync-backend.onrender.com`).
6. **Seed Database** (Optional): In Render Shell tab, run `npm run seed`.

---

## 4. Deploy Frontend on Vercel

1. Log into [Vercel](https://vercel.com/).
2. Click **Add New Project** and import your Git repository.
3. Configure Project Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: `https://skillsync-backend.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://skillsync-backend.onrender.com`
5. Click **Deploy**. Your application will be live at `https://your-project.vercel.app`!
