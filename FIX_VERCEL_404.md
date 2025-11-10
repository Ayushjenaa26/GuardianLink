# 🔧 Fix Vercel 404 Error

## Problem
Getting `404 (Not Found)` on https://guardianlink-omega.vercel.app/

## Root Cause
Vercel's root directory or build configuration is incorrect.

---

## ✅ Solution: Reconfigure Vercel Project

### Method 1: Via Vercel Dashboard (Recommended)

#### Step 1: Go to Project Settings
1. Visit: https://vercel.com/dashboard
2. Click on your **guardianlink-omega** project
3. Click **Settings** (top menu)

#### Step 2: Update Root Directory
1. Scroll to **General** section
2. Find **Root Directory**
3. Set to: `client/my-app`
4. Click **Save**

#### Step 3: Verify Build Settings
In **Settings** → **General**:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Create React App (should auto-detect) |
| **Build Command** | `npm run build` or leave empty (auto) |
| **Output Directory** | `build` or leave empty (auto) |
| **Install Command** | `npm install` or leave empty (auto) |
| **Root Directory** | `client/my-app` ⚠️ IMPORTANT |

#### Step 4: Add Environment Variables
In **Settings** → **Environment Variables**, add:

```
REACT_APP_API_URL = https://guardianlink-wk12.onrender.com
REACT_APP_ENV = production
REACT_APP_NAME = GuardianLink
REACT_APP_DEBUG = false
```

**Important:** Make sure to select **Production** environment for each variable.

#### Step 5: Trigger New Deployment
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots menu) → **Redeploy**
4. Uncheck "Use existing Build Cache"
5. Click **Redeploy**

Wait 2-3 minutes for the build to complete.

---

### Method 2: Delete and Recreate Project (If Method 1 Fails)

#### Step 1: Delete Current Project
1. Go to Vercel Dashboard
2. Open your guardianlink-omega project
3. Settings → Advanced → Delete Project
4. Confirm deletion

#### Step 2: Create New Project
1. Click **Add New...** → **Project**
2. Import your GitHub repository: **GuardianLink**
3. Configure the project:

**Build and Output Settings:**
```
Root Directory: client/my-app
Framework Preset: Create React App (auto-detected)
Build Command: npm run build (or leave empty)
Output Directory: build (or leave empty)
Install Command: npm install (or leave empty)
```

**Environment Variables:**
Add all 4 variables:
```
REACT_APP_API_URL = https://guardianlink-wk12.onrender.com
REACT_APP_ENV = production
REACT_APP_NAME = GuardianLink
REACT_APP_DEBUG = false
```

4. Click **Deploy**

Your new URL will be similar to: `https://guardianlink-omega-xxx.vercel.app`

⚠️ **Remember to update CORS on Render with your new Vercel URL!**

---

## 🧪 Testing After Fix

### 1. Test Homepage
Visit: https://guardianlink-omega.vercel.app/

**Expected:** Your GuardianLink homepage should load with the cosmic theme

### 2. Check Console
Press **F12** → **Console** tab

**Expected:** No 404 errors, no CORS errors (after Render CORS update)

### 3. Test Routing
Try navigating to: https://guardianlink-omega.vercel.app/auth

**Expected:** Login page should load (not 404)

### 4. Check Network Tab
F12 → **Network** tab → Refresh page

**Expected:** 
- `index.html` → Status 200
- All JS/CSS bundles → Status 200
- API calls to Render → Status 200 or CORS error (if CORS not set yet)

---

## 🔍 Verify Configuration

After redeploying, check the build logs:

1. Go to **Deployments** → Click latest deployment
2. Look for these success messages:
   ```
   ✓ Root Directory: client/my-app detected
   ✓ Installing dependencies...
   ✓ Running "npm run build"
   ✓ Build Completed
   ✓ Deployment Complete
   ```

If you see errors about missing files or wrong directory, the Root Directory is still wrong.

---

## 🎯 Quick Checklist

- [ ] Root Directory set to `client/my-app`
- [ ] Framework detected as Create React App
- [ ] All 4 environment variables added
- [ ] Variables set for Production environment
- [ ] Redeployed without build cache
- [ ] Build logs show success
- [ ] Homepage loads without 404
- [ ] Routes work (e.g., `/auth`)

---

## 🆘 Still Getting 404?

### Check Build Logs
Look for these common issues:

**Issue: "Cannot find package.json"**
→ Root Directory is wrong. Should be `client/my-app`

**Issue: "Build failed"**
→ Check if dependencies install correctly
→ Verify `package.json` has all dependencies

**Issue: "Output directory not found"**
→ Build command didn't create `build` folder
→ Check for build errors in logs

### Verify Local Build
Test locally first:

```powershell
cd "c:\Users\AYUSH\OneDrive - Indian Oil Corporation Limited\Documents\GitHub\GuardianLink\client\my-app"
npm install
npm run build
```

If local build works, Vercel should work too.

---

## 📝 After Fix: Update Render CORS

Once Vercel is working, update Render:

1. Go to: https://dashboard.render.com/
2. Open your service
3. Environment tab
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN = https://guardianlink-omega.vercel.app
   ```
   (or your new Vercel URL if you recreated the project)
5. Save (auto-redeploys)

---

## 🎉 Success Indicators

✅ Homepage loads at root URL
✅ No 404 errors in console
✅ Routes work (e.g., `/auth`, `/teacher-dashboard`)
✅ Static files (JS, CSS) load correctly
✅ API calls to Render backend work (after CORS fix)

---

## 💡 Prevention

To avoid this in the future:
- Always set Root Directory when deploying monorepo
- Use simple `vercel.json` (already fixed in your code)
- Test local build before deploying
- Check Vercel build logs immediately after deploy

---

## 📞 Need More Help?

If still having issues after following these steps:

1. Share the Vercel build logs (Deployments → Latest → View Build Logs)
2. Check if the problem is 404 or different error
3. Verify your GitHub repo has the latest code

The most common fix is simply setting Root Directory to `client/my-app`! 🎯
