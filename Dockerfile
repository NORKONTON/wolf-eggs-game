# Use Node.js 18 Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files from backend
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy public files for Telegram game
COPY backend/public/ ./public/

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]