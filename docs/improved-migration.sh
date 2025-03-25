#!/bin/bash

# Improved Documentation Migration Script
# This script migrates files to the new documentation structure

echo "Starting improved documentation migration..."

# Function to copy files if they exist
copy_if_exists() {
  if [ -d "$1" ] && [ "$(ls -A $1)" ]; then
    echo "Copying from $1 to $2"
    cp -r "$1"/* "$2"/
  else
    echo "Source directory $1 empty or doesn't exist - skipping"
  fi
}

# Architecture section
copy_if_exists "docs/api" "docs/architecture/api"
copy_if_exists "docs/database" "docs/architecture/database"
copy_if_exists "docs/state-management" "docs/architecture/state-management"
copy_if_exists "docs/security" "docs/architecture/security"
copy_if_exists "docs/performance" "docs/architecture/performance"

# Development section
copy_if_exists "docs/coding-standards" "docs/development/coding-standards"
copy_if_exists "docs/naming-standards" "docs/development/naming-standards"
copy_if_exists "docs/testing" "docs/development/testing"
copy_if_exists "docs/error-handling" "docs/development/error-handling"
copy_if_exists "docs/ci-cd" "docs/development/ci-cd"
copy_if_exists "docs/code-review" "docs/development/code-review"

# Features section
copy_if_exists "docs/components" "docs/features/components"
copy_if_exists "docs/application-definition" "docs/features/application-definition"

# Project Management section
copy_if_exists "docs/documentation-standards" "docs/project-management/documentation-standards"
copy_if_exists "docs/templates" "docs/project-management/templates"
copy_if_exists "docs/enhancements" "docs/project-management/enhancements"
copy_if_exists "docs/accessibility" "docs/project-management/accessibility"

# Getting Started section
copy_if_exists "docs/deployment" "docs/getting-started/deployment"
copy_if_exists "docs/setup" "docs/getting-started/setup"
copy_if_exists "docs/faq-troubleshooting" "docs/getting-started/faq-troubleshooting"
cp "docs/getting-started"/*.md "docs/getting-started/" 2>/dev/null || true

echo "Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review the migrated files to ensure everything transferred correctly"
echo "2. Update internal links in documentation files"
echo "3. Test all documentation links"
echo "4. Once verified, remove the old directory structure" 