#!/bin/bash

# Simple Agentforce MCP - Setup Verification Script

echo "============================================"
echo "Simple Agentforce MCP - Setup Verification"
echo "============================================"
echo ""

SUCCESS="\033[0;32m✓\033[0m"
FAILURE="\033[0;31m✗\033[0m"
WARNING="\033[0;33m!\033[0m"
INFO="\033[0;34mi\033[0m"

# Check Node.js
echo -n "Checking Node.js installation... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "$SUCCESS Found Node.js $NODE_VERSION"
    
    # Check if version is >= 14
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    if [ $NODE_MAJOR -lt 14 ]; then
        echo -e "$WARNING Node.js version is less than 14. Some features may not work correctly."
    fi
else
    echo -e "$FAILURE Node.js not found"
    echo "Please install Node.js v14 or higher"
    exit 1
fi

# Check npm
echo -n "Checking npm installation... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "$SUCCESS Found npm $NPM_VERSION"
else
    echo -e "$FAILURE npm not found"
    exit 1
fi

# Check for npm packages
echo -n "Checking @xlengelle-sf/agentforce-server installation... "
if npm list -g @xlengelle-sf/agentforce-server &> /dev/null; then
    SERVER_VERSION=$(npm list -g @xlengelle-sf/agentforce-server | grep agentforce-server | cut -d@ -f3)
    echo -e "$SUCCESS Found version $SERVER_VERSION"
else
    echo -e "$WARNING Not installed globally"
    echo "To install: npm install -g @xlengelle-sf/agentforce-server"
fi

echo -n "Checking @xlengelle-sf/agentforce-tool installation... "
if npm list -g @xlengelle-sf/agentforce-tool &> /dev/null; then
    TOOL_VERSION=$(npm list -g @xlengelle-sf/agentforce-tool | grep agentforce-tool | cut -d@ -f3)
    echo -e "$SUCCESS Found version $TOOL_VERSION"
else
    echo -e "$WARNING Not installed globally"
    echo "To install: npm install -g @xlengelle-sf/agentforce-tool"
fi

# Check for configuration files
echo -n "Checking for server configuration... "
if [ -f ~/.agentforce/.env ]; then
    echo -e "$SUCCESS Configuration found"
    # Check configuration content
    if grep -q "AGENTFORCE_CLIENT_ID" ~/.agentforce/.env && \
       grep -q "AGENTFORCE_CLIENT_SECRET" ~/.agentforce/.env && \
       grep -q "AGENTFORCE_ORG_BASE_URL" ~/.agentforce/.env && \
       grep -q "AGENTFORCE_AGENT_ID" ~/.agentforce/.env; then
        echo -e "$SUCCESS Configuration appears complete"
    else
        echo -e "$WARNING Configuration may be incomplete"
        echo "Please ensure your .env file contains all required variables"
    fi
else
    echo -e "$WARNING Configuration not found"
    echo "Please create a configuration file at ~/.agentforce/.env"
fi

# Check for local development setup
echo -n "Checking local development setup... "
if [ -d "server" ] && [ -d "tool" ]; then
    echo -e "$SUCCESS Repository structure found"
    
    # Check for node_modules
    echo -n "Checking for dependencies... "
    if [ -d "server/node_modules" ] && [ -d "tool/node_modules" ]; then
        echo -e "$SUCCESS Dependencies installed"
    else
        echo -e "$WARNING Dependencies not installed"
        echo "Run 'npm install' in both server and tool directories"
    fi
    
    # Check for build
    echo -n "Checking for build artifacts... "
    if [ -d "server/dist" ] && [ -d "tool/dist" ]; then
        echo -e "$SUCCESS Build artifacts found"
    else
        echo -e "$WARNING Build artifacts not found"
        echo "Run 'npm run build' to build the packages"
    fi
else
    echo -e "$INFO Not in development directory"
    echo "This appears to be a global installation"
fi

echo ""
echo "============================================"
echo "Verification complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Start the server: agentforce-server"
echo "2. Start the tool: agentforce-tool"
echo "3. Configure Claude Desktop with the tool URL"
echo ""
echo "For detailed instructions, see the documentation:"
echo "https://github.com/xlengelle-sf/simple-agentforce-mcp/blob/main/docs/GETTING_STARTED.md"