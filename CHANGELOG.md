# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-04-04

### Added
- Interactive CLI interface for configuration with prompts
- Docker support for containerized deployment
- Docker Compose configuration for coordinated deployment
- Support for Docker environment variables
- New documentation on Docker usage
- Improved server initialization with CLI prompts

## [1.1.0] - 2025-04-04

### Added
- Streaming response support for real-time message delivery
- New `send_message_stream` tool for initiating streaming responses
- New `get_stream_message` tool for retrieving message chunks
- New `cancel_stream` tool for cancelling active streams
- EventEmitter-based message handling backend
- SSE (Server-Sent Events) parsing for Agentforce streaming API
- Message queuing for stream buffering
- Updated documentation with streaming usage examples
- New test script for streaming functionality testing

## [1.0.0] - 2025-04-04

### Added
- Initial release of Simple Agentforce MCP
- Server component with Agentforce API integration
- Tool component for Claude Desktop integration
- Basic MCP protocol implementation
- Session management with sequenceId tracking
- Authentication with Salesforce OAuth
- API for creating sessions, sending messages, and ending sessions
- Complete documentation
- Test script for API verification
- Setup script for easy installation