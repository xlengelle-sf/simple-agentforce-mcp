# Simple Agentforce MCP

A simple and effective MCP server and tool suite for Salesforce Agentforce API, enabling seamless integration with Claude Desktop.

[![npm version](https://img.shields.io/npm/v/@xlengelle-sf/agentforce-server.svg)](https://www.npmjs.com/package/@xlengelle-sf/agentforce-server)
[![npm version](https://img.shields.io/npm/v/@xlengelle-sf/agentforce-tool.svg)](https://www.npmjs.com/package/@xlengelle-sf/agentforce-tool)
[![Tests](https://github.com/xlengelle-sf/simple-agentforce-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/xlengelle-sf/simple-agentforce-mcp/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@xlengelle-sf/agentforce-server)](https://nodejs.org/)

## Overview

This project provides a simplified way to connect Claude Desktop with Salesforce Agentforce, allowing users to interact with Salesforce agents directly from Claude Desktop. It implements the Model Context Protocol (MCP) to facilitate this integration.

✨ **Now available on npm!** ✨
- Server: `npm install -g @xlengelle-sf/agentforce-server`
- Tool: `npm install -g @xlengelle-sf/agentforce-tool`

## Features

- **Simple Integration**: Connect Claude Desktop to Salesforce Agentforce with minimal setup
- **Streaming Support**: Real-time message streaming for responsive interactions
- **Secure Authentication**: OAuth-based authentication with Salesforce
- **Easy Configuration**: Simple environment variable configuration
- **MCP Protocol**: Full implementation of the Model Context Protocol
- **Documentation**: Comprehensive guides and API documentation

## Prerequisites

1. Salesforce Agentforce setup
   - Create a Connected App with OAuth settings
   - Enable the scopes: "chatbot_api", "sfap_api", "api"
   - Note your Consumer Key and Consumer Secret
   - Setup an Agent and note its Agent ID

2. Node.js (v14 or later)

## Quick Start

### Installation via npm

```bash
# Install the server
npm install @xlengelle-sf/agentforce-server -g

# Install the tool
npm install @xlengelle-sf/agentforce-tool -g

# Start the server with interactive configuration
agentforce-server
# The server will prompt you for:
# - Salesforce Client ID
# - Salesforce Client Secret
# - Salesforce Org Base URL
# - Agentforce Agent ID
# - Server Port

# In another terminal, run the tool
agentforce-tool
```

Alternatively, you can manually create configuration files:

```bash
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
agentforce-server

# In another terminal, run the tool
agentforce-tool
```

### Installation from source

1. Clone the repository
   ```bash
   git clone https://github.com/agentforce-mcp/simple-agentforce-mcp.git
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

## Configuration in Claude Desktop

1. Open Claude Desktop
2. Go to Settings > Tools
3. Add a new tool with the following configuration:
   - Tool URL: `http://localhost:3001` (or the URL where the tool is running)
   - Tool Name: `agentforce`

## Repository Structure

This repository is organized as follows:

```
simple-agentforce-mcp/
├── server/              # MCP server for Agentforce API
│   ├── src/             # Server source code
│   ├── dist/            # Compiled JavaScript (after build)
│   └── README.md        # Server-specific documentation
├── tool/                # MCP tool for Claude Desktop
│   ├── src/             # Tool source code
│   ├── dist/            # Compiled JavaScript (after build)
│   └── README.md        # Tool-specific documentation
├── docs/                # Documentation files
└── setup.sh             # Setup script for local development
```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Getting Started](docs/GETTING_STARTED.md) - Quick start guide for new users
- [Installation Guide](docs/INSTALLATION.md) - Detailed installation instructions
- [Usage Guide](docs/USAGE.md) - How to use the integration with Claude Desktop
- [Docker Usage](docs/DOCKER_USAGE.md) - How to use Docker for deployment
- [API Reference](docs/API.md) - Detailed API documentation
- [Streaming Guide](docs/STREAMING.md) - How to use the streaming functionality
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and architecture
- [MCP Protocol Reference](docs/MCP_PROTOCOL.md) - Information about the MCP protocol
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Solutions to common issues
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute to the project
- [Changelog](CHANGELOG.md) - Version history and changes

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

### 3. send_message_stream

Sends a message to the Agentforce agent with streaming response.

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
  "streamId": "string"
}
```

### 4. get_stream_message

Gets a message chunk from a streaming response.

**Input:**
```json
{
  "streamId": "string"
}
```

**Output:**
```json
{
  "type": "chunk | complete | error | waiting",
  "data": "string",
  "error": "string"
}
```

### 5. cancel_stream

Cancels an active streaming message.

**Input:**
```json
{
  "streamId": "string"
}
```

**Output:**
```json
{
  "success": true
}
```

### 6. end_session

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

### Testing

```bash
cd server
npm test
```

## Contributing

Contributions are welcome! Please read the [Contributing Guide](docs/CONTRIBUTING.md) for details on how to submit pull requests, create issues, and more.

## License

[MIT License](LICENSE)

## Acknowledgements

- [Model Context Protocol](https://github.com/modelcontextprotocol/specification) - For the MCP specification
- [FastMCP](https://github.com/jlowin/fastmcp) - For inspiration on MCP implementation
- [Salesforce Agentforce API](https://developer.salesforce.com/docs/einstein/genai/guide/agent-api.html) - For the underlying API
- [Claude](https://claude.ai) - For enabling AI-powered experiences