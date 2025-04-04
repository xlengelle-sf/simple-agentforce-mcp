# @xlengelle-sf/agentforce-server

A MCP server for integrating with Salesforce Agentforce API.

## Installation

```bash
npm install @xlengelle-sf/agentforce-server -g
```

## Usage

### Configuration

You can configure the server in two ways:

#### 1. Interactive CLI (Recommended)

The server now features an interactive CLI that will prompt you for all required configuration values:

```bash
# Using the global installation
agentforce-server

# or using npx
npx @xlengelle-sf/agentforce-server
```

When you run the server for the first time, it will ask for:
- Salesforce Client ID
- Salesforce Client Secret
- Salesforce Org Base URL
- Agentforce Agent ID
- Server Port

The values will be saved to a `.env` file for future use.

#### 2. Manual Configuration

Alternatively, you can create a `.env` file manually with the following variables:

```env
# Server Configuration
PORT=3000

# Agentforce Configuration
AGENTFORCE_CLIENT_ID=your_client_id
AGENTFORCE_CLIENT_SECRET=your_client_secret
AGENTFORCE_ORG_BASE_URL=https://your-org.my.salesforce.com
AGENTFORCE_AGENT_ID=your_agent_id
```

### Start the Server

If you've already configured the server (either through the interactive CLI or manual setup), just run:

```bash
# Using the global installation
agentforce-server

# or using npx
npx @xlengelle-sf/agentforce-server
```

## API

The server exposes the following MCP endpoints:

- `GET /api/manifest`: Returns the manifest describing the available tools
- `POST /api/execute`: Executes a tool operation

### Available Tools

1. **create_session**: Create a new session with Agentforce agent
2. **send_message**: Send a message to the Agentforce agent
3. **send_message_stream**: Send a message with streaming response
4. **get_stream_message**: Get a message chunk from a streaming response
5. **cancel_stream**: Cancel an active streaming message
6. **end_session**: End the session with the Agentforce agent

## Streaming Support

This server supports real-time streaming responses from Agentforce using Server-Sent Events (SSE). To use streaming:

1. Start a stream with `send_message_stream`
2. Poll for message chunks with `get_stream_message`
3. Process chunks as they arrive
4. Handle completion with the `complete` chunk type

## Development

```bash
# Clone the repository
git clone https://github.com/agentforce-mcp/simple-agentforce-mcp.git
cd simple-agentforce-mcp/server

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test

# Test streaming functionality
npm run test:stream
```

## License

MIT