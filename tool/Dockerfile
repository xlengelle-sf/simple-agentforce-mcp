FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/

# Set environment variables (these will be overridden at runtime)
ENV TOOL_PORT=3001
ENV SERVER_URL=http://server:3000/api

# Expose port
EXPOSE 3001

# Run the tool
CMD ["node", "dist/index.js"]