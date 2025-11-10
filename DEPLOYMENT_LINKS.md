# 🌐 GuardianLink Deployment Links

## Live URLs

- **Frontend (Vercel)**: https://guardianlink-omega.vercel.app/
- **Backend (Render)**: https://guardianlink-wk12.onrender.com
- **API Health Check**: https://guardianlink-wk12.onrender.com/api/health

---

## 🔧 Configuration Status

### Frontend Configuration

- ✅ Vercel deployment live
- ⚠️ **ACTION REQUIRED**: Update environment variables on Vercel

### Backend Configuration

- ✅ Render deployment live
- ⚠️ **ACTION REQUIRED**: Update CORS_ORIGIN on Render

---

## 📋 Required Actions to Complete Deployment

### 1️⃣ Update Vercel Environment Variables

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Add/Update these variables:**

| Variable Name       | Value                                    |
| ------------------- | ---------------------------------------- |
| `REACT_APP_API_URL` | `https://guardianlink-wk12.onrender.com` |
| `REACT_APP_ENV`     | `production`                             |
| `REACT_APP_NAME`    | `GuardianLink`                           |
| `REACT_APP_DEBUG`   | `false`                                  |

**After adding/updating:**

1. Go to "Deployments" tab
2. Click on the latest deployment → Click "⋯" (three dots) → "Redeploy"
3. Check "Use existing Build Cache" → Click "Redeploy"

---

### 2️⃣ Update Render Environment Variables

Go to: https://dashboard.render.com/ → Your Service → Environment

**Add/Update this variable:**

| Variable Name | Value                                   |
| ------------- | --------------------------------------- |
| `CORS_ORIGIN` | `https://guardianlink-omega.vercel.app` |

**Important Notes:**

- NO trailing slash in the URL
- Exact match required
- Service will auto-redeploy (takes ~1-2 minutes)

**Verify other required variables are set:**

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your secure random string
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `3004` (optional, Render overrides this)

---

### 3️⃣ Verify MongoDB Atlas Configuration

Go to: https://cloud.mongodb.com/ → Network Access

**Ensure IP Whitelist includes:**

- `0.0.0.0/0` (Allow access from anywhere)
- This allows both Render and Vercel to connect

---

### 4️⃣ Push Updated Configuration to GitHub

Run these commands in PowerShell:

```powershell
cd "c:\Users\AYUSH\OneDrive - Indian Oil Corporation Limited\Documents\GitHub\GuardianLink"

git add .
git commit -m "Update deployment URLs for Vercel and Render"
git push origin main
```

This will trigger auto-deployment on both Vercel and Render.

---

## ✅ Testing Your Live Application

### Step 1: Test Backend Health

Open in browser: https://guardianlink-wk12.onrender.com/api/health

**Expected Response:**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

⚠️ **Note**: First request may take 30-50 seconds (Render free tier waking up)

### Step 2: Test Frontend

1. Open: https://guardianlink-omega.vercel.app/
2. Page should load without errors
3. Open Browser DevTools (F12) → Console tab
4. Check for errors (should be clean)

### Step 3: Test Teacher Login (Real Database)

1. Go to login page
2. Select "Teacher" role
3. Enter credentials from your database
4. Should successfully log in and load dashboard with real data

### Step 4: Test Parent/Admin (Mock Auth)

1. Go to login page
2. Select "Parent" or "Admin" role
3. Enter any email/name
4. Should successfully access dashboard (frontend-only)

---

## 🐛 Troubleshooting

### Issue: CORS Error in Console

**Error Message:**

```
Access to fetch at 'https://guardianlink-wk12.onrender.com/api/...'
from origin 'https://guardianlink-omega.vercel.app' has been blocked by CORS policy
```

**Solution:**

1. Go to Render → Environment
2. Set `CORS_ORIGIN` to `https://guardianlink-omega.vercel.app`
3. Save and wait for redeploy (~1-2 minutes)
4. Refresh your Vercel app

---

### Issue: API Returns 404 or Connection Failed

**Solution:**

1. Verify backend is running: https://guardianlink-wk12.onrender.com/api/health
2. Check Vercel environment variables have correct `REACT_APP_API_URL`
3. Redeploy Vercel after updating env vars

---

### Issue: Backend is Slow (30-50 seconds first load)

**Explanation:**

- Render free tier spins down after 15 minutes of inactivity
- First request wakes it up (takes 30-50 seconds)
- Subsequent requests are fast

**Solutions:**

1. Upgrade to Render paid plan ($7/month for always-on)
2. Use UptimeRobot to ping every 10 minutes (keeps it awake)
3. Accept the delay for free tier

---

### Issue: MongoDB Connection Error

**Check Render Logs:**

1. Go to Render Dashboard → Your Service → Logs
2. Look for "Connected to MongoDB" message
3. If error, verify `MONGODB_URI` is correct

**Verify MongoDB Atlas:**

1. Network Access has `0.0.0.0/0` whitelisted
2. Database user has correct permissions
3. Connection string format is correct

---

### Issue: Environment Variables Not Loading

**Vercel:**

1. Variables must start with `REACT_APP_`
2. After adding, must redeploy (not just refresh)
3. Check Deployment logs to verify variables are injected

**Render:**

1. After updating, service auto-redeploys
2. Check Logs to see variables loaded
3. Sensitive values are hidden in logs (shows as `***`)

---

## 🔄 Continuous Deployment Setup

Both platforms are configured for auto-deployment:

**When you push to GitHub `main` branch:**

1. Vercel automatically rebuilds frontend (~2-3 min)
2. Render automatically redeploys backend (~2-3 min)
3. Changes go live automatically

**To disable auto-deploy:**

- **Vercel**: Project Settings → Git → Disable
- **Render**: Service Settings → Auto-Deploy → Off

---

## 📊 Monitoring Your Application

### Vercel Analytics

1. Go to your Vercel project
2. Click "Analytics" tab
3. View traffic, performance, errors

### Render Logs

1. Go to Render Dashboard → Your Service
2. Click "Logs" tab
3. View real-time server logs
4. Filter by error level

### MongoDB Atlas

1. Go to MongoDB Atlas → Cluster
2. Click "Metrics" tab
3. View database operations, connections

---

## 🎉 Success Checklist

- [ ] Backend health endpoint returns 200 OK
- [ ] Frontend loads at https://guardianlink-omega.vercel.app/
- [ ] No CORS errors in browser console
- [ ] Teacher login works with database
- [ ] Parent/Admin pages load (mock auth)
- [ ] Attendance data displays correctly
- [ ] All dashboards render properly
- [ ] Sign out redirects to login page

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting section
2. Review deployment logs on Vercel/Render
3. Verify environment variables are correct
4. Check MongoDB Atlas connection
5. Test backend health endpoint directly

---

**Deployment Date**: November 10, 2025  
**Status**: ⚠️ Configuration Pending (Complete steps 1-4 above)

Once you complete the required actions, your GuardianLink application will be fully live! 🚀
