# GitHub Repository Setup

This document provides instructions for pushing this project to a new GitHub repository.

## Creating a New GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the "+" icon in the upper right corner and select "New repository"
3. Enter the repository details:
   - Repository name: `simple-agentforce-mcp`
   - Description: "Simple Agentforce MCP integration for Claude Desktop"
   - Visibility: Select either "Public" or "Private"
   - DO NOT initialize the repository with README, .gitignore, or license
4. Click "Create repository"

## Pushing Your Local Repository to GitHub

After creating the GitHub repository, you'll see instructions for pushing an existing repository.

If using HTTPS:

```bash
# Navigate to your local repository
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp

# Add the remote repository URL
git remote add origin https://github.com/yourusername/simple-agentforce-mcp.git

# Push the repository to GitHub (including all branches and tags)
git push -u origin main
```

If using SSH:

```bash
# Navigate to your local repository
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp

# Add the remote repository URL
git remote add origin git@github.com:yourusername/simple-agentforce-mcp.git

# Push the repository to GitHub (including all branches and tags)
git push -u origin main
```

## Verifying the Push

1. Refresh your GitHub repository page
2. You should see all your files and commit history
3. Verify that the GitHub Actions workflow has been triggered (check the "Actions" tab)

## Setting Up GitHub Pages (Optional)

To set up GitHub Pages for your documentation:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "GitHub Pages"
4. In the "Source" section, select "main branch" and "/docs" folder
5. Click "Save"
6. Your documentation will be available at `https://yourusername.github.io/simple-agentforce-mcp/`

## Publishing to npm (Optional)

To publish the packages to npm:

```bash
# Navigate to the server directory
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp/server

# Log in to npm (if not already logged in)
npm login

# Build and publish the server package
npm run build
npm publish

# Navigate to the tool directory
cd ../tool

# Build and publish the tool package
npm run build
npm publish
```

## Next Steps

After pushing your repository to GitHub:

1. Set up branch protection rules
2. Add contributors
3. Configure issue and pull request templates
4. Set up GitHub Actions workflows (if needed)
5. Add labels for issues and pull requests

Your repository is now ready for collaboration with other developers!