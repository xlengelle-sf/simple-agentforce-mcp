#!/bin/bash

# Simple Agentforce MCP Release Script

# Function to display usage
usage() {
  echo "Usage: $0 [major|minor|patch]"
  echo "Bumps the version number and prepares a release"
  echo ""
  echo "Arguments:"
  echo "  major - Bump major version (X.0.0)"
  echo "  minor - Bump minor version (0.X.0)"
  echo "  patch - Bump patch version (0.0.X)"
  exit 1
}

# Check for argument
if [ $# -ne 1 ]; then
  usage
fi

# Parse argument
case $1 in
  major|minor|patch)
    VERSION_TYPE=$1
    ;;
  *)
    usage
    ;;
esac

echo "Creating a new $VERSION_TYPE release..."

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Update version in all package.json files
cd server
npm version $VERSION_TYPE --no-git-tag-version
SERVER_VERSION=$(node -p "require('./package.json').version")
cd ../tool
npm version $VERSION_TYPE --no-git-tag-version
cd ..

# Update root package.json
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Update changelog - prepend a new version section
NEW_DATE=$(date +%Y-%m-%d)
TEMP_FILE=$(mktemp)
cat > $TEMP_FILE << EOL
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [$NEW_VERSION] - $NEW_DATE

### Added
- 

### Changed
- 

### Fixed
- 

EOL

# Append the existing content, skipping the first 7 lines (the header)
tail -n +7 CHANGELOG.md >> $TEMP_FILE
mv $TEMP_FILE CHANGELOG.md

echo "Changelog template for $NEW_VERSION created. Please edit CHANGELOG.md with your changes."

# Build the project
echo "Building project..."
npm run build

# Prompt user to edit the changelog
echo ""
echo "Please edit CHANGELOG.md now to add your release notes."
echo "Press Enter when you're done to continue with the release process..."
read

# Commit the changes
echo "Committing version bump..."
git add package.json server/package.json tool/package.json CHANGELOG.md
git commit -m "Bump version to $NEW_VERSION"

# Create a tag
echo "Creating tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"

echo ""
echo "Release preparation complete!"
echo ""
echo "Next steps:"
echo "1. Review the changes: git show v$NEW_VERSION"
echo "2. Push the changes and tag: git push && git push --tags"
echo "3. Build and publish packages: npm run build && cd server && npm publish && cd ../tool && npm publish"
echo ""