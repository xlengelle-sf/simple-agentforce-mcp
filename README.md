# Simple Agentforce MCP

A simple and effective MCP server and tool suite for Salesforce Agentforce API, enabling seamless integration with Claude Desktop.

## Overview

This project provides a simplified way to connect Claude Desktop with Salesforce Agentforce, allowing users to interact with Salesforce agents directly from Claude Desktop. It implements the Model Context Protocol (MCP) to facilitate this integration.

## Components

- **Server**: The MCP server that handles communication with Agentforce API
- **Tool**: The MCP tool that integrates with Claude Desktop

## Prerequisites

1. Salesforce Agentforce setup
   - Create a Connected App with OAuth settings
   - Enable the scopes: "chatbot_api", "sfap_api", "api"
   - Note your Consumer Key and Consumer Secret
   - Setup an Agent and note its Agent ID

2. Node.js (v14 or later)

## Quick Start

### Installation from source

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/simple-agentforce-mcp.git
   cd simple-agentforce-mcp
   ```

2. Run the setup script
   ```bash
   ./setup.sh
   ```

3. Configure your environment variables
   - Edit `server/.env` with your Salesforce credentials
   - Edit `tool/.env` if your server is running on a different URL

4. Start the server
   ```bash
   cd server && npm start
   ```

5. In another terminal, start the tool
   ```bash
   cd tool && npm start
   ```

### Installation via npm

```bash
# Install the server
npm install @simple-agentforce/server -g

# Install the tool
npm install @simple-agentforce/tool -g

# Create configuration files
mkdir -p ~/.simple-agentforce
cat > ~/.simple-agentforce/.env << EOL
# Agentforce Configuration
AGENTFORCE_CLIENT_ID=your_client_id
AGENTFORCE_CLIENT_SECRET=your_client_secret
AGENTFORCE_ORG_BASE_URL=https://your-org.my.salesforce.com
AGENTFORCE_AGENT_ID=your_agent_id
EOL

# Start the server
simple-agentforce-server

# In another terminal, run the tool
simple-agentforce-tool
```

## Configuration in Claude Desktop

1. Open Claude Desktop
2. Go to Settings > Tools
3. Add a new tool with the following configuration:
   - Tool URL: `http://localhost:3001` (or the URL where the tool is running)
   - Tool Name: `agentforce`

## API Usage

The MCP server exposes the following tools:

### 1. create_session

Creates a new session with the Agentforce agent.

**Input:** None

**Output:**
```json
{
  "sessionId": "string"
}
```

### 2. send_message

Sends a message to the Agentforce agent.

**Input:**
```json
{
  "sessionId": "string",
  "message": "string"
}
```

**Output:**
```json
{
  "message": "string"
}
```

### 3. end_session

Ends the session with the Agentforce agent.

**Input:**
```json
{
  "sessionId": "string"
}
```

**Output:**
```json
{
  "success": true
}
```

## Development

### Server

```bash
cd server
npm install
npm run dev
```

### Tool

```bash
cd tool
npm install
npm run dev
```

## License

MIT