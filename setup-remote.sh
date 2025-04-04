#!/bin/bash

# Simple Agentforce MCP - Remote Setup Script

echo "============================================"
echo "Simple Agentforce MCP - Remote Setup"
echo "============================================"
echo ""

# Set the remote URL
REMOTE_URL="https://github.com/xlengelle-sf/simple-agentforce-mcp.git"

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add the remote
echo "Adding remote 'origin' as $REMOTE_URL..."
git remote add origin $REMOTE_URL

echo ""
echo "Remote added successfully!"
echo ""
echo "To push to GitHub:"
echo "git push -u origin main"
echo ""
echo "To check the remote configuration:"
echo "git remote -v"