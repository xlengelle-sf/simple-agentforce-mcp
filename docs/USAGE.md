# Usage Guide

This guide explains how to use the Simple Agentforce MCP integration with Claude Desktop.

## Configuring Claude Desktop

1. Open Claude Desktop
2. Navigate to Settings > Tools
3. Click "Add Tool"
4. Enter the following information:
   - Tool URL: `http://localhost:3001` (or the URL where your tool is running)
   - Tool Name: `agentforce` (or a custom name of your choice)
5. Click "Add Tool"

## Testing the Integration

Once the tool is configured in Claude Desktop, you can test it with the following prompts:

```
Can you help me use the agentforce tool to talk to my Salesforce agent?
```

Claude should respond by creating a session with your Agentforce agent and enabling you to exchange messages.

## Understanding the Workflow

The Simple Agentforce MCP integration follows this workflow:

1. **Session Creation**: When you first invoke the tool, it creates a new session with your Agentforce agent.
2. **Message Exchange**: Your messages are sent to the agent, maintaining the correct sequence ID for proper conversation flow.
3. **Session Termination**: The session can be terminated explicitly, or it will time out after a period of inactivity.

## Example Conversation

Here's an example of how a conversation might flow:

**You**: Can you use the agentforce tool to help me track a sales opportunity?

**Claude**: I'll help you track a sales opportunity using Agentforce. Let me connect to your Salesforce agent.

[Claude uses the agentforce tool to create a session]

I've connected to your Salesforce agent. What details would you like to know about your sales opportunities?

**You**: Show me the top opportunities closing this month.

[Claude sends your message to the Agentforce agent and returns the response]

**Claude**: According to your Salesforce data, here are your top opportunities closing this month:

1. Acme Corp - $120,000 - 90% probability
2. TechSolutions Inc - $85,000 - 75% probability
3. Global Industries - $65,000 - 85% probability

Would you like more details on any of these opportunities?

## Advanced Usage

### Working with Multiple Sessions

By default, Claude will maintain one session per conversation. If you want to explicitly create a new session, you can ask Claude to end the current session and start a new one:

```
Can you end the current Agentforce session and start a new one?
```

### Handling Complex Queries

When working with complex data or multi-step processes, it's often better to break down your requests into smaller steps:

**Instead of**:
"Show me all opportunities, create a new one for Acme Corp, and then add a new contact for John Smith."

**Try**:
"Show me all opportunities."
[Review response]
"Create a new opportunity for Acme Corp."
[Review response]
"Add a new contact for John Smith."

This approach helps ensure each step is processed correctly.

## Troubleshooting

### Connection Issues

If Claude can't connect to the Agentforce agent, check:

1. The server and tool are both running
2. Your Salesforce credentials are correct
3. The tool URL in Claude Desktop is correct

### Authentication Problems

If you see authentication errors:

1. Verify your Client ID and Client Secret
2. Ensure your Connected App has the right OAuth scopes
3. Check that your Salesforce org base URL is correct

### Invalid Agent ID

If you encounter "Invalid Agent ID" errors:

1. Verify the Agent ID in your configuration
2. Ensure the agent is active in your Salesforce environment
3. Check that your user has permission to access the agent

## Getting Help

If you encounter any issues not covered in this guide, please:

1. Check the logs of both the server and tool components
2. Review the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
3. Submit an issue on the GitHub repository