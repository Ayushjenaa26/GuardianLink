# 🚀 Quick Deployment Reference

## TL;DR - Deploy in 15 Minutes

### Step 1️⃣: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2️⃣: Deploy Backend (Render)
1. Go to https://dashboard.render.com/
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=<generate secure random string>
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
5. Click "Create Web Service"
6. **Copy your backend URL**: `https://xxx.onrender.com`

### Step 3️⃣: Deploy Frontend (Vercel)
1. Go to https://vercel.com/dashboard
2. New Project → Import GitHub repo
3. Settings:
   - Root Directory: `client/my-app`
   - Framework: Create React App
4. Environment Variables:
   ```
   REACT_APP_API_URL=https://xxx.onrender.com
   REACT_APP_ENV=production
   REACT_APP_NAME=GuardianLink
   REACT_APP_DEBUG=false
   ```
5. Deploy!

### Step 4️⃣: Update CORS
1. Go back to Render
2. Update `CORS_ORIGIN` with your actual Vercel URL
3. Save (auto-redeploys)

### Step 5️⃣: Test
- Visit your Vercel URL
- Try logging in
- Check browser console

## 🔑 Generate JWT Secret (PowerShell)
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## ⚠️ Important Notes
- **Render Free Tier**: Spins down after 15 mins → First request takes 30-50 seconds
- **MongoDB**: Whitelist IP `0.0.0.0/0` in Atlas Network Access
- **Never commit** `.env` files with real credentials
- **Auto-deploy**: Both services auto-deploy on GitHub push

## 📝 URLs You'll Have
- **Frontend**: `https://guardianlink-xxx.vercel.app`
- **Backend**: `https://guardianlink-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/health`

## 🐛 Common Issues
| Problem | Solution |
|---------|----------|
| CORS Error | Update `CORS_ORIGIN` on Render to match Vercel URL |
| API 404 | Check `REACT_APP_API_URL` in Vercel env vars |
| Build fails | Check logs, verify root directory paths |
| Slow response | Render free tier wakes up (30-50s first request) |

## 📚 Full Guide
See `DEPLOYMENT.md` for detailed step-by-step instructions.

---

**Good luck! 🎉** Your app will be live in production soon!
