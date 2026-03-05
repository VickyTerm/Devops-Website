# =============================================
# Production-ready Node.js Dockerfile
# =============================================

FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy only dependency files first (best layer caching)
COPY package*.json ./

# Install dependencies with modern, reproducible command
# --omit=dev replaces the deprecated --production
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Security: Change ownership and run as non-root user
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]