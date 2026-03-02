# Build and Launch Guide
> Glaze Insurance Admin Dashboard

This guide provides step-by-step instructions for building and launching the Glaze Insurance Admin dashboard in a production environment. 

## 1. Prerequisites

Ensure the deployment environment has the following installed:
- **Node.js**: Version 20.x or higher
- **Package Manager**: npm (v10+ recommended)
- **Environment API**: The backend service must be deployed and accessible.

## 2. Environment Configuration

The application requires environment variables to connect to the backend API.
Create a `.env.production` file or set these variables in your deployment provider (e.g., Vercel, AWS, Docker):

```env
# The public URL of the backend API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 3. Local Build & Preview (Verification)

Before deploying to a live server, verify the production build locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Linter and Type Check:**
   It's highly recommended to catch errors before building.
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

3. **Build the Application:**
   ```bash
   npm run build
   ```
   *Next.js will generate an optimized production build in the `.next` directory.*

4. **Start the Production Server Local Preview:**
   ```bash
   npm run start
   ```
   *The app should now be running in production mode at `http://localhost:3000`.*

---

## 4. Deployment Strategies

### Option A: Managed Platform (Vercel / Netlify) - Recommended
Next.js applications are best hosted on Vercel as it requires zero configuration for standard setups.

1. Connect your Git repository to Vercel/Netlify.
2. Set the Framework Preset to **Next.js**.
3. Add the `NEXT_PUBLIC_API_URL` to the Environment Variables settings.
4. Deploy.

### Option B: Docker Containerization
If you are deploying to AWS ECS, Kubernetes, or a VPS, containerizing the app is best.

**Dockerfile Example:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Add environment variable for build time if necessary, otherwise provide at runtime
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```
*(Note: To use the standalone output requires setting `output: 'standalone'` in `next.config.ts`)*

### Option C: Traditional VPS (PM2)
If hosting on a standard Linux VM:

1. Clone repository to server.
2. Run `npm ci`.
3. Create `.env.production` with `NEXT_PUBLIC_API_URL`.
4. Run `npm run build`.
5. Start app using PM2 to keep it alive:
   ```bash
   npm install -g pm2
   pm2 start npm --name "glaze-admin" -- run start
   ```

## 5. Post-Launch Checklist

- [ ] **Verify API Connectivity:** Ensure the dashboard can successfully log in and read data from the external backend API.
- [ ] **Check Client Routing:** Navigate between a few pages to verify Next.js client-side routing is functioning without 404s.
- [ ] **Monitor Logs:** Check server logs (PM2 logs, Vercel logs, docker logs) for any initial runtime exceptions.
