# ✅ GuardianLink Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment (Do These First)

- [ ] **MongoDB Atlas Configuration**

  - [ ] Whitelist IP `0.0.0.0/0` in Network Access
  - [ ] Test connection string works locally
  - [ ] Copy connection string for later

- [ ] **GitHub Repository**

  - [ ] All code committed and pushed to GitHub
  - [ ] Repository is public or linked to Render/Vercel
  - [ ] `.gitignore` includes `.env` files

- [ ] **Generate JWT Secret**
  - [ ] Run PowerShell command to generate random string
  - [ ] Save it somewhere safe (you'll need it for Render)

---

## Backend Deployment (Render)

- [ ] **Create Web Service**

  - [ ] Sign up/Login to Render.com
  - [ ] Click "New +" → "Web Service"
  - [ ] Connect GitHub repository
  - [ ] Select GuardianLink repo

- [ ] **Configure Service**

  - [ ] Name: `guardianlink-backend` (or your choice)
  - [ ] Root Directory: `server`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`

- [ ] **Add Environment Variables**

  - [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
  - [ ] `JWT_SECRET` = Generated random string
  - [ ] `NODE_ENV` = `production`
  - [ ] `CORS_ORIGIN` = Leave empty for now (update after Vercel)

- [ ] **Deploy Backend**

  - [ ] Click "Create Web Service"
  - [ ] Wait for build (2-3 minutes)
  - [ ] Note any build errors in logs
  - [ ] Copy backend URL: `https://______.onrender.com`

- [ ] **Test Backend**
  - [ ] Visit: `https://your-backend-url.onrender.com/api/health`
  - [ ] Should see: `{"status":"ok","message":"Server is running"}`

---

## Frontend Deployment (Vercel)

- [ ] **Update Production Config**

  - [ ] Edit `client/my-app/.env.production`
  - [ ] Set `REACT_APP_API_URL` to your Render backend URL
  - [ ] Commit and push to GitHub

- [ ] **Create Vercel Project**

  - [ ] Sign up/Login to Vercel.com
  - [ ] Click "Add New..." → "Project"
  - [ ] Import GuardianLink repository
  - [ ] Select the repo

- [ ] **Configure Project**

  - [ ] Framework Preset: Create React App (auto-detected)
  - [ ] Root Directory: `client/my-app`
  - [ ] Build Command: `npm run build` (auto)
  - [ ] Output Directory: `build` (auto)

- [ ] **Add Environment Variables**

  - [ ] `REACT_APP_API_URL` = Your Render backend URL
  - [ ] `REACT_APP_ENV` = `production`
  - [ ] `REACT_APP_NAME` = `GuardianLink`
  - [ ] `REACT_APP_DEBUG` = `false`

- [ ] **Deploy Frontend**

  - [ ] Click "Deploy"
  - [ ] Wait for build (2-3 minutes)
  - [ ] Note any build errors
  - [ ] Copy Vercel URL: `https://______.vercel.app`

- [ ] **Test Frontend**
  - [ ] Visit your Vercel URL
  - [ ] Check if page loads correctly
  - [ ] Open browser DevTools Console

---

## Post-Deployment Configuration

- [ ] **Update CORS on Render**

  - [ ] Go back to Render dashboard
  - [ ] Open your backend service
  - [ ] Environment tab
  - [ ] Add/Update `CORS_ORIGIN` = Your Vercel URL
  - [ ] Save (auto-redeploys in ~1 minute)

- [ ] **Test Full Integration**
  - [ ] Visit Vercel URL
  - [ ] Try Teacher login (use real DB credentials)
  - [ ] Check if data loads correctly
  - [ ] Try Parent/Admin login (mock auth)
  - [ ] Check browser console for errors

---

## Troubleshooting

If you encounter issues, check these:

- [ ] **CORS Errors**

  - [ ] Verify `CORS_ORIGIN` on Render matches Vercel URL exactly
  - [ ] No trailing slash in URLs
  - [ ] Check browser console for specific error

- [ ] **API Connection Errors**

  - [ ] Verify `REACT_APP_API_URL` on Vercel is correct
  - [ ] Test backend health endpoint directly
  - [ ] Check Render logs for errors

- [ ] **MongoDB Connection Errors**

  - [ ] Check MongoDB Atlas Network Access has `0.0.0.0/0`
  - [ ] Verify connection string format
  - [ ] Check Render logs: "Connected to MongoDB" message

- [ ] **Build Failures**
  - [ ] Check build logs on Render/Vercel
  - [ ] Verify root directories are correct
  - [ ] Check package.json scripts

---

## Optional Enhancements

- [ ] **Custom Domain (Optional)**

  - [ ] Add custom domain to Vercel
  - [ ] Configure DNS settings
  - [ ] Update CORS_ORIGIN on Render

- [ ] **Monitoring**

  - [ ] Enable Vercel Analytics
  - [ ] Set up Render email notifications
  - [ ] Add UptimeRobot for backend ping (prevents sleep)

- [ ] **Security**
  - [ ] Review MongoDB user permissions
  - [ ] Rotate JWT_SECRET if needed
  - [ ] Enable Render auto-deploy on push (or disable if preferred)

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Backend health endpoint returns 200 OK
- ✅ Frontend loads without console errors
- ✅ Teacher login connects to database and loads data
- ✅ Parent/Admin pages load (mock auth)
- ✅ No CORS errors in browser console
- ✅ Attendance, marks, behavior data displays correctly

---

## 📝 Important URLs

Write down your URLs here:

- **Frontend (Vercel)**: ****************\_****************
- **Backend (Render)**: ****************\_****************
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub Repo**: https://github.com/Ayushjenaa26/GuardianLink

---

## 🆘 Need Help?

- Review `DEPLOYMENT.md` for detailed instructions
- Check `QUICK_DEPLOY.md` for common solutions
- See `MONGODB_SETUP.md` for database configuration
- Check Render/Vercel documentation
- Look at deployment logs for specific errors

---

**Total Estimated Time**: 15-25 minutes (for first deployment)

Good luck! 🚀
