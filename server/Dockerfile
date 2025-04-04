FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/

# Set environment variables (these will be overridden at runtime)
ENV PORT=3000
ENV AGENTFORCE_CLIENT_ID=""
ENV AGENTFORCE_CLIENT_SECRET=""
ENV AGENTFORCE_ORG_BASE_URL=""
ENV AGENTFORCE_AGENT_ID=""

# Expose port
EXPOSE 3000

# Run the server with interactive CLI
CMD ["node", "dist/cli.js"]