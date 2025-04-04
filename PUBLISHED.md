# Packages Successfully Published!

The Agentforce MCP packages have been successfully published to npm and are now available for use:

## Published Packages

- [@xlengelle-sf/agentforce-server](https://www.npmjs.com/package/@xlengelle-sf/agentforce-server) (v1.2.0) - The MCP server for Agentforce API with interactive CLI
- [@xlengelle-sf/agentforce-tool](https://www.npmjs.com/package/@xlengelle-sf/agentforce-tool) (v1.2.0) - The MCP tool for Claude Desktop integration

## Installation

```bash
# Install globally
npm install -g @xlengelle-sf/agentforce-server
npm install -g @xlengelle-sf/agentforce-tool

# Run the server with interactive CLI
agentforce-server
# Follow the prompts to configure the server

# In another terminal, run the tool
agentforce-tool
```

## Docker Installation

```bash
# Clone the repository
git clone https://github.com/xlengelle-sf/simple-agentforce-mcp.git
cd simple-agentforce-mcp

# Run with Docker Compose
docker-compose up -d
```

## Next Steps

1. **Create a GitHub Repository**
   - Run the GitHub setup script to configure your repository:
     ```bash
     ./setup-github.sh
     ```
   - Follow the instructions to create a new repository on GitHub
   - Push your code to GitHub:
     ```bash
     git push -u origin main
     ```

2. **Update Badges**
   - The npm version badges in the README.md will now work correctly
   - They display the current version of the packages

3. **Promote Your Work**
   - Share the npm package links with potential users
   - Consider writing a blog post about your implementation
   - Create examples and tutorials

## Version Management

For future updates:

1. Use the release script to bump version numbers:
   ```bash
   ./release.sh [major|minor|patch]
   ```

2. Publish new versions:
   ```bash
   ./publish-packages.sh
   ```

## Feedback and Issues

Encourage users to submit issues and feedback through your GitHub repository once it's set up.