## 🗒️ MongoDB Atlas Configuration for Deployment

### Allow Render/Vercel to Access Your Database

1. **Log in to MongoDB Atlas**

   - Go to https://cloud.mongodb.com/

2. **Navigate to Network Access**

   - Click "Network Access" in left sidebar
   - Click "Add IP Address"

3. **Whitelist All IPs** (for Render/Vercel)
   - Click "Allow Access From Anywhere"
   - Or manually add: `0.0.0.0/0`
   - Add comment: "Render and Vercel deployment"
   - Click "Confirm"

⚠️ **Security Note**: This allows any IP to connect, but your database is still protected by username/password in the connection string.

### Alternative: Whitelist Specific IPs (More Secure)

If you want to restrict access, add these IP ranges:

**Render IP Ranges** (Free tier uses dynamic IPs):

```
3.73.66.50/32
3.73.66.51/32
52.204.99.49/32
52.204.99.50/32
```

**Note**: Render free tier may use different IPs, so `0.0.0.0/0` is recommended for simplicity.

### Connection String Format

Make sure your `MONGODB_URI` looks like this:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

Replace:

- `<username>`: Your database username
- `<password>`: Your database password (URL-encoded if it contains special characters)
- `<database>`: `guardianlink` (your database name)
- `xxxxx`: Your cluster ID

### Testing Connection

Test your connection string locally before deploying:

```bash
cd server
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_CONNECTION_STRING').then(() => console.log('✓ Connected')).catch(err => console.error('✗ Error:', err));"
```

If it connects successfully, you're ready to deploy!
