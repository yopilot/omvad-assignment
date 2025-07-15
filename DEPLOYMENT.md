# Deployment Environment Variables

When deploying your Link Saver application to production (like Render, Vercel, etc.), you need to set the following environment variables:

## Required Environment Variables

### 1. DATABASE_URL
For SQLite (development):
```
DATABASE_URL="file:./dev.db"
```

For PostgreSQL (production - recommended):
```
DATABASE_URL="postgresql://username:password@hostname:port/database_name"
```

### 2. NEXT_PUBLIC_JWT_SECRET
A secure secret key for JWT token signing. **CRITICAL: Change this in production!**
```
NEXT_PUBLIC_JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 3. NODE_ENV (automatically set by most platforms)
```
NODE_ENV="production"
```

## Deployment Notes

1. **Database**: For production, it's recommended to use PostgreSQL instead of SQLite. You can get a free PostgreSQL database from:
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - [Neon](https://neon.tech)
   - [Render PostgreSQL](https://render.com/docs/databases)

2. **JWT Secret**: Generate a secure random string for production. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Build Command**: The application uses `npm run build` which includes Prisma generation.

4. **Start Command**: Use `npm start` to run the production server.

## Platform-Specific Instructions

### Render
1. Connect your GitHub repository
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. Add environment variables in the Environment tab

### Vercel
1. Connect your GitHub repository
2. Set environment variables in the Environment Variables section
3. Vercel automatically detects Next.js projects

### Railway
1. Connect your GitHub repository
2. Add environment variables in the Variables tab
3. Railway automatically detects the build process
