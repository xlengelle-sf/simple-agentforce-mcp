# Docker Usage Guide

This guide explains how to use the Docker setup for the Agentforce MCP Server and Tool.

## Prerequisites

- Docker and Docker Compose installed on your system
- Salesforce Agentforce credentials (Client ID, Client Secret, Org Base URL, Agent ID)

## Running with Docker Compose

### Option 1: Using Environment Variables

1. Create a `.env` file in the root directory with your Agentforce credentials:

```env
AGENTFORCE_CLIENT_ID=your_client_id
AGENTFORCE_CLIENT_SECRET=your_client_secret
AGENTFORCE_ORG_BASE_URL=https://your-org.my.salesforce.com
AGENTFORCE_AGENT_ID=your_agent_id
```

2. Start the services with Docker Compose:

```bash
docker-compose up -d
```

### Option 2: Running the Interactive CLI in Docker

If you prefer to use the interactive CLI to configure the server:

1. Build the server image:

```bash
docker build -t agentforce-server ./server
```

2. Run the server container with an interactive terminal:

```bash
docker run -it -p 3000:3000 agentforce-server node dist/cli.js
```

3. Follow the prompts to enter your Salesforce Agentforce credentials.

4. After configuring the server, you can start both services with Docker Compose:

```bash
docker-compose up -d
```

## Accessing the Services

- The Agentforce MCP Server is accessible at: http://localhost:3000
- The Agentforce MCP Tool is accessible at: http://localhost:3001

## Configuration

### Server Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The port on which the server runs | 3000 |
| AGENTFORCE_CLIENT_ID | Salesforce Client ID | (required) |
| AGENTFORCE_CLIENT_SECRET | Salesforce Client Secret | (required) |
| AGENTFORCE_ORG_BASE_URL | Salesforce Org Base URL | (required) |
| AGENTFORCE_AGENT_ID | Agentforce Agent ID | (required) |

### Tool Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| TOOL_PORT | The port on which the tool runs | 3001 |
| SERVER_URL | URL of the MCP server API | http://server:3000/api |

## Persisting Configuration

To persist your configuration between container restarts:

1. Create a Docker volume:

```bash
docker volume create agentforce-config
```

2. Mount the volume to store the .env file:

```bash
docker run -it -p 3000:3000 -v agentforce-config:/app/config agentforce-server node dist/cli.js
```

3. Update your docker-compose.yml to use the volume:

```yaml
services:
  server:
    # ... other configuration
    volumes:
      - agentforce-config:/app/config
      
volumes:
  agentforce-config:
```

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. View the container logs:

```bash
docker-compose logs server
docker-compose logs tool
```

3. Ensure the server container is running before the tool container
4. Verify network connectivity between containers