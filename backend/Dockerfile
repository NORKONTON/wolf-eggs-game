# Use Node.js 18 Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]