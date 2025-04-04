#!/bin/bash

# Simple Agentforce MCP Setup Script

echo "Setting up Simple Agentforce MCP..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating server .env file..."
  cp .env.sample .env
  echo "Please update the .env file with your Agentforce credentials."
fi

# Install tool dependencies
echo "Installing tool dependencies..."
cd ../tool
npm install
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating tool .env file..."
  cp .env.sample .env
fi

cd ..

echo "Setup complete!"
echo "To start the server: cd server && npm start"
echo "To start the tool: cd tool && npm start"
echo ""
echo "You can also use the global commands after npm installation:"
echo "npm install -g ./server"
echo "npm install -g ./tool"
echo ""
echo "Then run:"
echo "simple-agentforce-server"
echo "simple-agentforce-tool"