# Contributing Guide

Thank you for your interest in contributing to the Simple Agentforce MCP project! This guide will help you get started with development and making contributions.

## Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/yourusername/simple-agentforce-mcp.git
   cd simple-agentforce-mcp
   ```

2. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install tool dependencies
   cd ../tool
   npm install
   ```

3. **Set Up Environment**:
   ```bash
   # For server
   cd server
   cp .env.sample .env
   # Edit .env with your credentials
   
   # For tool
   cd ../tool
   cp .env.sample .env
   # Edit .env with your configuration
   ```

4. **Run in Development Mode**:
   ```bash
   # For server
   cd server
   npm run dev
   
   # For tool (in a separate terminal)
   cd tool
   npm run dev
   ```

## Project Structure

```
simple-agentforce-mcp/
├── server/                 # MCP server component
│   ├── src/                # Source code
│   │   ├── config/         # Configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── tests/          # Test scripts
│   │   ├── cli.ts          # CLI entry point
│   │   └── index.ts        # Main application
│   ├── .env.sample         # Sample environment variables
│   ├── package.json        # Dependencies and scripts
│   └── tsconfig.json       # TypeScript configuration
│
├── tool/                   # MCP tool component
│   ├── src/                # Source code
│   │   ├── config/         # Configuration
│   │   ├── types/          # TypeScript types
│   │   ├── cli.ts          # CLI entry point
│   │   └── index.ts        # Main application
│   ├── .env.sample         # Sample environment variables
│   ├── package.json        # Dependencies and scripts
│   └── tsconfig.json       # TypeScript configuration
│
├── docs/                   # Documentation
├── setup.sh                # Setup script
└── README.md               # Project overview
```

## Coding Guidelines

1. **TypeScript**: Use TypeScript for all code.
2. **Formatting**: Use prettier for code formatting.
3. **Naming Conventions**:
   - Use camelCase for variables and functions
   - Use PascalCase for classes and interfaces
   - Use kebab-case for file names
4. **Error Handling**: Always include proper error handling.
5. **Type Safety**: Leverage TypeScript's type system for safety.
6. **Documentation**: Add JSDoc comments for public APIs.

## Testing

We use a combination of unit tests and integration tests:

```bash
# Run server tests
cd server
npm test

# Add new tests in the server/src/tests directory
```

## Pull Request Process

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your feature or fix.

3. **Test**: Ensure all tests pass and add new tests if needed.

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Please follow [Conventional Commits](https://www.conventionalcommits.org/) format.

5. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**: Open a PR against the main repository.

7. **Code Review**: Address any feedback from maintainers.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality
- **PATCH**: Backwards-compatible bug fixes

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md with changes
3. Create a git tag for the version
4. Publish to npm registry

## Feature Requests and Bug Reports

Please use GitHub Issues to report bugs or request features. When reporting bugs, include:

1. Description of the issue
2. Steps to reproduce
3. Expected vs. actual behavior
4. Environment details (OS, Node.js version, etc.)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive and welcoming community.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Thank you for contributing to the Simple Agentforce MCP project!