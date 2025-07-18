# Install dependencies using Node 22 (builder stage)
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies using npm
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your app source
COPY . .

# Build the app
RUN npm run build

# --- Production stage ---
FROM node:22-slim AS runner

# Set NODE_ENV for production
ENV NODE_ENV=production

# Create non-root user
RUN useradd -m nextjs

# Set working directory
WORKDIR /app

# Copy only needed files from the builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts* ./  

# Ensure nextjs user owns the .next directory
RUN chown -R nextjs:nextjs /app/.next

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Run Next.js app
CMD ["node_modules/.bin/next", "start"]
