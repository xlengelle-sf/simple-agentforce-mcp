# Publishing the Simple Agentforce MCP Packages

This guide provides step-by-step instructions for publishing the project to GitHub and npm.

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in
2. Click the "+" icon in the upper right corner and select "New repository"
3. Enter repository details:
   - Repository name: `simple-agentforce-mcp`
   - Description: "Simple Agentforce MCP integration for Claude Desktop"
   - Make it public if you want it to be easily accessible
   - Do not initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## 2. Push to GitHub

After creating the repository, you'll see instructions for pushing an existing repository. Use the following commands:

```bash
# Navigate to your local repository
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp

# Update the remote URL in package.json files if needed to match your GitHub username
# (you can use find/replace to update 'agentforce-mcp' to your GitHub username)

# Add the remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/simple-agentforce-mcp.git

# Push the repository to GitHub
git push -u origin main
```

## 3. Publish to npm

Before publishing, make sure you have an npm account and are logged in.

```bash
# Log in to npm
npm login
```

### Publish the Server Package

```bash
# Navigate to the server directory
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp/server

# Ensure the package is built
npm run build

# Publish to npm
npm publish --access public
```

### Publish the Tool Package

```bash
# Navigate to the tool directory
cd /Users/xlengelle/Code/Claude-MCP/simple-agentforce-mcp/tool

# Ensure the package is built
npm run build

# Publish to npm
npm publish --access public
```

## 4. Test the Published Packages

After publishing, test the packages to make sure they work correctly:

```bash
# Install the server globally
npm install -g @xlengelle-sf/agentforce-server

# Install the tool globally
npm install -g @xlengelle-sf/agentforce-tool

# Run the server
agentforce-server

# In a different terminal, run the tool
agentforce-tool
```

## 5. Enable GitHub Pages (Optional)

To make your documentation available online:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "GitHub Pages"
4. Select "main branch" as the source
5. Choose the "/docs" folder if you only want to publish the documentation
6. Click "Save"

Your documentation will be available at `https://YOUR_USERNAME.github.io/simple-agentforce-mcp/`

## 6. Create a Release

1. Go to your repository on GitHub
2. Click on "Releases" in the right sidebar
3. Click "Create a new release"
4. Enter the tag version (e.g., "v1.1.0")
5. Set the release title (e.g., "v1.1.0 - Initial Release with Streaming Support")
6. Add a description based on your CHANGELOG.md
7. Click "Publish release"

## Maintenance

For future updates:

1. Make your changes to the codebase
2. Update the version numbers in package.json files
3. Update the CHANGELOG.md
4. Commit and push changes to GitHub
5. Publish new versions to npm
6. Create a new GitHub release

You can use the included `release.sh` script to automate part of this process:

```bash
./release.sh [major|minor|patch]
```