#!/bin/bash

# Simple Agentforce MCP - GitHub Setup Script

echo "============================================"
echo "Simple Agentforce MCP - GitHub Setup"
echo "============================================"
echo ""
echo "This script will help you create and push to a GitHub repository."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo "Git is not installed. Please install git first."
  exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
  echo "Not in a git repository. Please run this script from the root of the simple-agentforce-mcp project."
  exit 1
fi

# Check if remote already exists
REMOTE_EXISTS=$(git remote -v | grep origin | wc -l)
if [ $REMOTE_EXISTS -gt 0 ]; then
  read -p "Remote 'origin' already exists. Do you want to overwrite it? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 1
  fi
  git remote remove origin
fi

# Ask for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
  echo "GitHub username is required."
  exit 1
fi

# Ask for GitHub repo name
read -p "Enter repository name (default: simple-agentforce-mcp): " REPO_NAME
REPO_NAME=${REPO_NAME:-simple-agentforce-mcp}

# Ask for protocol
echo "Choose protocol:"
echo "1. HTTPS"
echo "2. SSH"
read -p "Enter your choice (1-2): " PROTOCOL_CHOICE

# Set remote URL based on protocol choice
if [ "$PROTOCOL_CHOICE" = "1" ]; then
  REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
elif [ "$PROTOCOL_CHOICE" = "2" ]; then
  REMOTE_URL="git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
else
  echo "Invalid choice. Using HTTPS."
  REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# Update package.json files with correct repository URLs
echo "Updating package.json files with correct repository URLs..."
sed -i.bak "s|git+https://github.com/[^/]*/[^\"]*|git+https://github.com/$GITHUB_USERNAME/$REPO_NAME|g" package.json server/package.json tool/package.json
sed -i.bak "s|https://github.com/[^/]*/[^/]*/issues|https://github.com/$GITHUB_USERNAME/$REPO_NAME/issues|g" package.json server/package.json tool/package.json
sed -i.bak "s|https://github.com/[^/]*/[^/]*#readme|https://github.com/$GITHUB_USERNAME/$REPO_NAME#readme|g" package.json
sed -i.bak "s|https://github.com/[^/]*/[^/]*/tree/main/server#readme|https://github.com/$GITHUB_USERNAME/$REPO_NAME/tree/main/server#readme|g" server/package.json
sed -i.bak "s|https://github.com/[^/]*/[^/]*/tree/main/tool#readme|https://github.com/$GITHUB_USERNAME/$REPO_NAME/tree/main/tool#readme|g" tool/package.json

# Clean up backup files
rm -f package.json.bak server/package.json.bak tool/package.json.bak

# Add remote
echo "Adding remote 'origin' as $REMOTE_URL..."
git remote add origin $REMOTE_URL

# Commit the changes
git add package.json server/package.json tool/package.json
git commit -m "Update repository URLs for GitHub"

# Instructions for GitHub repo creation
echo ""
echo "============================================"
echo "Next Steps:"
echo "============================================"
echo ""
echo "1. Go to GitHub and create a new repository:"
echo "   https://github.com/new"
echo ""
echo "2. Repository name: $REPO_NAME"
echo "3. Description: Simple Agentforce MCP integration for Claude Desktop"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
echo "6. After creating the repository, push your code:"
echo "   git push -u origin main"
echo ""
echo "Your local repository is now configured with the remote URL:"
echo "$REMOTE_URL"