# Base image
FROM node:18-alpine

# Create working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application source
COPY . .

# App will run on port 3000
EXPOSE 3000

# Environment variable
ENV PORT=3000

# Start the application
CMD ["node", "app.js"]