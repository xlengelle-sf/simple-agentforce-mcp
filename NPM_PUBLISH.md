# npm Publishing Guide

This document provides instructions for publishing the Simple Agentforce MCP packages to npm.

## Prerequisites

1. An npm account (create one at [npmjs.com](https://www.npmjs.com/signup))
2. Node.js and npm installed on your machine
3. Access rights to publish to the npm registry

## Package Preparation

The project is split into two packages:

1. `@simple-agentforce/server`: The MCP server for Agentforce API
2. `@simple-agentforce/tool`: The MCP tool for Claude Desktop

Before publishing, make sure the package.json files have:
- Correct version numbers 
- Proper descriptions
- Appropriate keywords
- License information
- Author information
- Repository links

## Publishing Process

### Step 1: Login to npm

```bash
npm login
```

Follow the prompts to log in with your npm account credentials.

### Step 2: Build the Packages

Build both packages to ensure the latest changes are included:

```bash
# Build all packages (from the root directory)
npm run build

# Or build packages individually
cd server && npm run build
cd ../tool && npm run build
```

### Step 3: Publish the Server Package

```bash
# Navigate to the server directory
cd server

# Publish the package
npm publish --access public
```

### Step 4: Publish the Tool Package

```bash
# Navigate to the tool directory
cd ../tool

# Publish the package
npm publish --access public
```

## Updating Packages

When making updates, follow these steps:

1. Make changes to the codebase
2. Update the version number in package.json files
3. Update the CHANGELOG.md file
4. Build the packages
5. Publish the updated packages

To update an existing package:

```bash
# For server
cd server
npm version patch  # or minor or major
npm publish --access public

# For tool
cd ../tool
npm version patch  # or minor or major
npm publish --access public
```

## Version Management

Follow semantic versioning:
- MAJOR: Breaking API changes (1.0.0 → 2.0.0)
- MINOR: New features, backward compatible (1.0.0 → 1.1.0)
- PATCH: Bug fixes, backward compatible (1.0.0 → 1.0.1)

## Scoped Packages

The packages are published under the `@xlengelle-sf` scope. To use them, users will need to install them:

```bash
npm install @xlengelle-sf/agentforce-server -g
npm install @xlengelle-sf/agentforce-tool -g
```

## Package Documentation

Make sure to update the documentation in the README.md file with:
- Installation instructions
- Usage examples
- Configuration options
- Links to detailed documentation

## Testing Published Packages

After publishing, test the packages from npm to ensure they work correctly:

```bash
# Create a test directory
mkdir test-agentforce
cd test-agentforce

# Install packages
npm install @xlengelle-sf/agentforce-server @xlengelle-sf/agentforce-tool

# Test functionality
npx agentforce-server
# In another terminal
npx agentforce-tool
```

## Unpublishing Packages

If you need to unpublish a package (within 72 hours of publishing):

```bash
npm unpublish @xlengelle-sf/agentforce-server@1.1.0
npm unpublish @xlengelle-sf/agentforce-tool@1.1.0
```

Note: npm has restrictions on unpublishing packages to ensure stability for users.