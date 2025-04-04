# Installation Guide

This guide walks you through the installation process for the Simple Agentforce MCP components.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js and npm**: Version 14.x or higher
2. **Salesforce Agentforce setup**:
   - A Connected App with OAuth settings enabled
   - Required scopes: "chatbot_api", "sfap_api", "api", "refresh_token", "offline_access"
   - Consumer Key and Consumer Secret
   - An Agent setup with its Agent ID

## Installation Options

### Option 1: Installing from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/simple-agentforce-mcp.git
   cd simple-agentforce-mcp
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

3. Create environment files:
   - For the server:
     ```bash
     cd server
     cp .env.sample .env
     ```
   - For the tool:
     ```bash
     cd ../tool
     cp .env.sample .env
     ```

4. Edit the `.env` files with your Salesforce credentials:
   - In `server/.env`, add your Salesforce credentials
   - In `tool/.env`, configure the tool options if needed

### Option 2: Installing via npm (Global)

```bash
# Install the server globally
npm install -g @simple-agentforce/server

# Install the tool globally
npm install -g @simple-agentforce/tool

# Create a configuration directory
mkdir -p ~/.simple-agentforce

# Create configuration file
cat > ~/.simple-agentforce/.env << EOL
# Agentforce Configuration
AGENTFORCE_CLIENT_ID=your_client_id
AGENTFORCE_CLIENT_SECRET=your_client_secret
AGENTFORCE_ORG_BASE_URL=https://your-org.my.salesforce.com
AGENTFORCE_AGENT_ID=your_agent_id
EOL
```

### Option 3: Docker Installation

Coming soon.

## Configuration

### Server Configuration

The server uses the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Port number for the server | 3000 | No |
| AGENTFORCE_CLIENT_ID | Your Salesforce Connected App Client ID | - | Yes |
| AGENTFORCE_CLIENT_SECRET | Your Salesforce Connected App Client Secret | - | Yes |
| AGENTFORCE_ORG_BASE_URL | Your Salesforce organization base URL | - | Yes |
| AGENTFORCE_AGENT_ID | Your Agentforce Agent ID | - | Yes |

### Tool Configuration

The tool uses the following environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| SERVER_URL | URL of the MCP server | http://localhost:3000/api | No |
| TOOL_PORT | Port number for the tool | 3001 | No |

## Starting the Applications

### From Source

Start the server:
```bash
cd server
npm start
```

Start the tool (in a separate terminal):
```bash
cd tool
npm start
```

### Global Installation

Start the server:
```bash
simple-agentforce-server
```

Start the tool (in a separate terminal):
```bash
simple-agentforce-tool
```

## Verifying Installation

Once both components are running, you should see:
- Server running on port 3000 (or your configured port)
- Tool running on port 3001 (or your configured port)

To verify the installation is working correctly, run the test script:

```bash
cd server
npm test
```

If everything is configured correctly, you should see successful test results.

## Next Steps

After installation, proceed to [USAGE.md](./USAGE.md) for instructions on configuring Claude Desktop and using the Agentforce MCP integration.