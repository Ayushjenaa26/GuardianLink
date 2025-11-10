# 🚀 Final Steps to Make Your Website Live

## Your Deployment URLs
- **Frontend**: https://guardianlink-omega.vercel.app/
- **Backend**: https://guardianlink-wk12.onrender.com

---

## ⚡ Quick Actions (5 minutes)

### Action 1: Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Find and click on your GuardianLink project
3. Click **Settings** → **Environment Variables**
4. Add these 4 variables:

```
REACT_APP_API_URL = https://guardianlink-wk12.onrender.com
REACT_APP_ENV = production
REACT_APP_NAME = GuardianLink
REACT_APP_DEBUG = false
```

5. Click **Deployments** tab → Latest deployment → **⋯** → **Redeploy**

---

### Action 2: Update Render CORS Settings

1. Go to: https://dashboard.render.com/
2. Click on your GuardianLink service
3. Click **Environment** in left sidebar
4. Find or add variable:

```
CORS_ORIGIN = https://guardianlink-omega.vercel.app
```

**(No trailing slash!)**

5. Click **Save** (auto-redeploys in ~1 minute)

---

### Action 3: Push to GitHub

Run these commands in your terminal:

```powershell
git add .
git commit -m "Configure production deployment URLs"
git push origin main
```

This triggers auto-deployment on both platforms.

---

## ✅ Test Your Live Site (2 minutes)

### 1. Test Backend
Open: https://guardianlink-wk12.onrender.com/api/health

Should see:
```json
{"status":"ok","message":"Server is running"}
```

*First load may take 30-50 seconds (Render waking up)*

### 2. Test Frontend
Open: https://guardianlink-omega.vercel.app/

- Page should load
- Open DevTools (F12) → Console
- Check for no errors

### 3. Test Login
- Try Teacher login with real credentials
- Should connect to database and load dashboard

---

## 🎉 That's It!

Once you complete these 3 actions, your GuardianLink app is **LIVE** and fully functional!

---

## 📝 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://guardianlink-omega.vercel.app/ | React App |
| Backend | https://guardianlink-wk12.onrender.com | Express API |
| Health Check | https://guardianlink-wk12.onrender.com/api/health | Test backend |

---

## 🆘 Common Issues

**CORS Error?**
→ Make sure `CORS_ORIGIN` on Render is exactly: `https://guardianlink-omega.vercel.app` (no trailing slash)

**API not connecting?**
→ Verify `REACT_APP_API_URL` on Vercel is: `https://guardianlink-wk12.onrender.com`

**Slow first load?**
→ Render free tier wakes up in 30-50 seconds. Normal behavior.

---

Need detailed help? Check `DEPLOYMENT_LINKS.md`
