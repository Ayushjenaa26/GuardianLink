# GuardianLink Deployment Guide

This guide covers deploying GuardianLink's frontend to **Vercel** and backend to **Render**.

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas** - Your database is already set up

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (GuardianLink)
4. Configure the service:

   - **Name**: `guardianlink-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preferred plan)

### Step 3: Add Environment Variables on Render

In your Render service settings, go to **Environment** tab and add:

| Key           | Value                                | Notes                                   |
| ------------- | ------------------------------------ | --------------------------------------- |
| `MONGODB_URI` | `mongodb+srv://...`                  | Your MongoDB Atlas connection string    |
| `JWT_SECRET`  | Generate a secure random string      | Use: `openssl rand -base64 32`          |
| `PORT`        | `3004`                               | Render will override this automatically |
| `NODE_ENV`    | `production`                         | Sets production mode                    |
| `CORS_ORIGIN` | `https://your-vercel-app.vercel.app` | Update after Vercel deployment          |

**To generate a secure JWT_SECRET**, run in PowerShell:

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (2-3 minutes)
3. Copy your backend URL: `https://guardianlink-backend.onrender.com`
4. Test it: Visit `https://your-backend-url.onrender.com/api/health`

⚠️ **Note**: Free tier on Render spins down after inactivity. First request may take 30-50 seconds.

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Update Backend URL

Update `client/my-app/.env.production` with your Render backend URL:

```env
REACT_APP_API_URL=https://guardianlink-backend.onrender.com
REACT_APP_ENV=production
REACT_APP_NAME=GuardianLink
REACT_APP_DEBUG=false
```

Commit and push:

```bash
git add .
git commit -m "Update production backend URL"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (GuardianLink)
4. Configure the project:

   - **Framework Preset**: Create React App
   - **Root Directory**: `client/my-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Add **Environment Variables**:

   - Click "Environment Variables" section
   - Add the following:

   | Name                | Value                                       |
   | ------------------- | ------------------------------------------- |
   | `REACT_APP_API_URL` | `https://guardianlink-backend.onrender.com` |
   | `REACT_APP_ENV`     | `production`                                |
   | `REACT_APP_NAME`    | `GuardianLink`                              |
   | `REACT_APP_DEBUG`   | `false`                                     |

6. Click **"Deploy"**
7. Wait 2-3 minutes for build to complete
8. Your app will be live at: `https://your-project-name.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd client/my-app

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Update CORS on Render

1. Go back to your Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Update `CORS_ORIGIN` with your Vercel URL:
   ```
   https://your-project-name.vercel.app
   ```
5. Save changes (service will auto-redeploy)

---

## ✅ Verification

### Test Backend

```bash
# Health check
curl https://guardianlink-backend.onrender.com/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

### Test Frontend

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Try logging in with Teacher credentials
3. Check browser console for any CORS or API errors

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

#### Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### Render:

1. Go to Service Settings → Custom Domain
2. Add your domain and configure DNS

### Environment Variables Updates

If you need to update environment variables:

**Vercel**:

1. Project Settings → Environment Variables
2. Edit → Save
3. Go to Deployments → Click ⋯ → Redeploy

**Render**:

1. Service → Environment
2. Edit values → Save (auto-redeploys)

---

## 🐛 Troubleshooting

### Issue: CORS Error in Browser Console

**Solution**: Ensure `CORS_ORIGIN` on Render matches your Vercel URL exactly (no trailing slash)

### Issue: API Returns 404

**Solution**: Check that backend is running on Render and URL is correct in frontend `.env.production`

### Issue: "Cannot connect to database"

**Solution**: Verify MongoDB Atlas connection string in Render environment variables

### Issue: Render Service Sleeps

**Solution**: Free tier spins down after 15 mins inactivity. Upgrade to paid plan or use a service like UptimeRobot to ping your backend every 10 minutes.

### Issue: Build Fails on Vercel

**Solution**:

- Check build logs for errors
- Ensure `client/my-app` is set as root directory
- Verify all dependencies are in `package.json`

### Issue: Environment Variables Not Loading

**Solution**:

- Vercel: Variables must start with `REACT_APP_`
- After adding variables, trigger a new deployment
- Check Deployment logs to verify variables are set

---

## 📊 Monitoring

### Vercel Analytics

- Go to your project → Analytics tab
- View page views, performance metrics

### Render Logs

- Service Dashboard → Logs tab
- View real-time server logs
- Filter by error level

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. Push to GitHub `main` branch
2. Vercel automatically rebuilds frontend
3. Render automatically redeploys backend
4. Changes live in 2-3 minutes

To disable auto-deployment:

- **Vercel**: Project Settings → Git → Disable
- **Render**: Service Settings → Auto-Deploy → Off

---

## 💡 Tips

1. **Keep `.env` files secure** - Never commit real `.env` files to GitHub
2. **Use `.env.example`** - Commit this as a template for other developers
3. **Monitor logs** - Check Render logs regularly for errors
4. **Set up alerts** - Use Render's notification features
5. **Database backups** - Regular MongoDB Atlas backups are crucial

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

## 🎉 Success!

Your GuardianLink app should now be live:

- Frontend: `https://your-project-name.vercel.app`
- Backend: `https://guardianlink-backend.onrender.com`

Share the link and start using your deployed application!
