#!/bin/bash

# Event Planner Release Script
# This script helps prepare a new release for GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Event Planner Release Preparation${NC}"
echo "==============================================="

# Check if version argument is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Version number required.${NC}"
  echo "Usage: ./release.sh [version]"
  echo "Example: ./release.sh 1.1.0"
  exit 1
fi

VERSION=$1

# Confirm version
echo -e "Preparing release version: ${GREEN}v$VERSION${NC}"
echo 
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Update package.json
echo -e "${YELLOW}Updating package.json version...${NC}"
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
echo -e "${GREEN}✓ package.json updated${NC}"

# Build project
echo -e "${YELLOW}Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix errors before continuing.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"

# Commit changes
echo -e "${YELLOW}Committing changes...${NC}"
git add .
git commit -m "Release v$VERSION"
echo -e "${GREEN}✓ Changes committed${NC}"

# Create tag
echo -e "${YELLOW}Creating tag v$VERSION...${NC}"
git tag -a "v$VERSION" -m "Version $VERSION"
echo -e "${GREEN}✓ Tag created${NC}"

# Push to GitHub
echo -e "${YELLOW}Do you want to push to GitHub now? (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Pushing to GitHub...${NC}"
  git push origin main
  git push origin --tags
  echo -e "${GREEN}✓ Pushed to GitHub${NC}"
  
  echo -e "${YELLOW}Next steps:${NC}"
  echo "1. Go to GitHub repository"
  echo "2. Navigate to Releases"
  echo "3. Click 'Draft a new release'"
  echo "4. Select tag v$VERSION"
  echo "5. Fill in the release title and description (use RELEASE.md content)"
  echo "6. Click 'Publish release'"
else
  echo -e "${YELLOW}Remember to push changes and tags when ready:${NC}"
  echo "git push origin main"
  echo "git push origin --tags"
fi

echo
echo -e "${GREEN}Release preparation complete!${NC}" 