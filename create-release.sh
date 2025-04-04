#!/bin/bash

# Script to create a GitHub release for Simple Agentforce MCP

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) is not installed. Please install it first."
  echo "See: https://cli.github.com/manual/installation"
  exit 1
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
  echo "You are not logged in to GitHub. Please run 'gh auth login' first."
  exit 1
fi

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Prepare release description
echo "Creating release for version $VERSION"
echo ""
echo "What's new in this release? (Brief description)"
read -e DESCRIPTION

echo ""
echo "List of new features (comma separated):"
read -e FEATURES
IFS=',' read -ra FEATURE_ARRAY <<< "$FEATURES"
FEATURES_LIST=""
for i in "${FEATURE_ARRAY[@]}"; do
  FEATURES_LIST+="- $(echo $i | xargs)\n"
done

echo ""
echo "List of bug fixes (comma separated, leave empty if none):"
read -e BUGFIXES
BUGFIXES_LIST=""
if [ ! -z "$BUGFIXES" ]; then
  IFS=',' read -ra BUGFIX_ARRAY <<< "$BUGFIXES"
  for i in "${BUGFIX_ARRAY[@]}"; do
    BUGFIXES_LIST+="- $(echo $i | xargs)\n"
  done
else
  BUGFIXES_LIST="No bug fixes in this release.\n"
fi

echo ""
echo "List of contributors (comma separated):"
read -e CONTRIBUTORS
IFS=',' read -ra CONTRIBUTOR_ARRAY <<< "$CONTRIBUTORS"
CONTRIBUTORS_LIST=""
for i in "${CONTRIBUTOR_ARRAY[@]}"; do
  CONTRIBUTORS_LIST+="- $(echo $i | xargs)\n"
done

# Create temporary release notes file
TEMP_FILE=$(mktemp)
cat .github/RELEASE_TEMPLATE.md > $TEMP_FILE
sed -i.bak "s/{VERSION}/$VERSION/g" $TEMP_FILE
sed -i.bak "s/{BRIEF_DESCRIPTION}/$DESCRIPTION/g" $TEMP_FILE
sed -i.bak "s/{FEATURES_LIST}/$FEATURES_LIST/g" $TEMP_FILE
sed -i.bak "s/{BUGFIXES_LIST}/$BUGFIXES_LIST/g" $TEMP_FILE
sed -i.bak "s/{CONTRIBUTORS_LIST}/$CONTRIBUTORS_LIST/g" $TEMP_FILE
rm -f $TEMP_FILE.bak

# Create GitHub release
echo ""
echo "Creating GitHub release v$VERSION..."
gh release create "v$VERSION" --title "Release v$VERSION" --notes-file $TEMP_FILE

# Clean up
rm -f $TEMP_FILE

echo ""
echo "Release v$VERSION created successfully!"
echo "Visit the releases page to view it: https://github.com/xlengelle-sf/simple-agentforce-mcp/releases"