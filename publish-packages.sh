#!/bin/bash

# Simple Agentforce MCP - Package Publishing Script

echo "============================================"
echo "Simple Agentforce MCP - Package Publication"
echo "============================================"
echo ""
echo "This script will guide you through publishing the packages to npm."
echo ""

# Check if user is logged in to npm
npm whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "You are not logged in to npm. Please login first."
  npm login
fi

echo "Logged in as $(npm whoami)"
echo ""

# Ask for confirmation
read -p "Are you sure you want to publish both packages? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Publication cancelled."
  exit 1
fi

echo ""
echo "Building packages..."
npm run build

echo ""
echo "Publishing server package..."
cd server
npm publish --access public
if [ $? -ne 0 ]; then
  echo "Error publishing server package."
  exit 1
fi

echo ""
echo "Publishing tool package..."
cd ../tool
npm publish --access public
if [ $? -ne 0 ]; then
  echo "Error publishing tool package."
  exit 1
fi

echo ""
echo "============================================"
echo "Publication complete!"
echo "============================================"
echo ""
echo "Your packages are now available on npm:"
echo "- @xlengelle-sf/agentforce-server"
echo "- @xlengelle-sf/agentforce-tool"
echo ""
echo "Users can install them with:"
echo "npm install @xlengelle-sf/agentforce-server -g"
echo "npm install @xlengelle-sf/agentforce-tool -g"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Push your code to GitHub"
echo "3. Create a release on GitHub"
echo ""
echo "See PUBLISHING.md for detailed instructions."