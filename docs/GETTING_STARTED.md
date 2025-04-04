# Getting Started with Simple Agentforce MCP

This guide will help you quickly set up and start using the Simple Agentforce MCP integration with Claude Desktop.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v14 or later) installed
2. **Salesforce Agentforce** setup:
   - A Connected App with OAuth settings
   - Consumer Key and Secret
   - Agent ID

## Quick Installation

### Step 1: Install the Packages

```bash
# Install the server globally
npm install -g @xlengelle-sf/agentforce-server

# Install the tool globally
npm install -g @xlengelle-sf/agentforce-tool
```

### Step 2: Configure the Server

Create a configuration file:

```bash
mkdir -p ~/.agentforce
cat > ~/.agentforce/.env << EOL
# Agentforce Configuration
AGENTFORCE_CLIENT_ID=your_client_id
AGENTFORCE_CLIENT_SECRET=your_client_secret
AGENTFORCE_ORG_BASE_URL=https://your-org.my.salesforce.com
AGENTFORCE_AGENT_ID=your_agent_id
EOL
```

Replace the placeholder values with your actual Salesforce credentials.

### Step 3: Start the Server

In a terminal window, run:

```bash
agentforce-server
```

You should see output indicating the server is running on port 3000.

### Step 4: Start the Tool

In a second terminal window, run:

```bash
agentforce-tool
```

You should see output indicating the tool is running on port 3001.

### Step 5: Configure Claude Desktop

1. Open Claude Desktop
2. Go to Settings > Tools
3. Add a new tool with the following configuration:
   - Tool URL: `http://localhost:3001`
   - Tool Name: `agentforce`
4. Save the tool configuration

## Testing the Integration

To test that everything is working:

1. In Claude Desktop, ask Claude to use the Agentforce tool:
   ```
   Can you help me use the agentforce tool to talk to my Salesforce agent?
   ```

2. Claude should create a session with your Agentforce agent and allow you to exchange messages.

## Using Streaming Responses

For a more interactive experience, you can use the streaming functionality:

```
Can you use the agentforce tool with streaming to answer my question about Salesforce accounts?
```

## Troubleshooting

If you encounter issues:

1. **Server won't start**:
   - Check if the port is already in use
   - Verify your credentials in the `.env` file

2. **Tool won't connect to server**:
   - Make sure the server is running
   - Check the server URL in the tool configuration

3. **Claude can't use the tool**:
   - Verify the tool URL in Claude Desktop settings
   - Check both server and tool are running

For more detailed troubleshooting, see the [Troubleshooting Guide](TROUBLESHOOTING.md).

## Next Steps

- Explore the [API Reference](API.md) to understand the available tools
- Learn about [Streaming](STREAMING.md) for real-time responses
- Check the [Architecture Overview](ARCHITECTURE.md) to understand how it works

Happy integrating!