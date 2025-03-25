#!/bin/bash

# Documentation Restructuring Script
# This script reorganizes the Event Management System documentation into five main categories

echo "Starting documentation reorganization..."

# Create main directories if they don't exist
echo "Creating main directory structure..."
mkdir -p docs/{getting-started,architecture,development,features,project-management}/{setup,environment,deployment,faq-troubleshooting,database,api,state-management,security,performance,coding-standards,naming-standards,testing,error-handling,ci-cd,code-review,components,application-definition,user-guide,documentation-standards,templates,enhancements,accessibility,technical-debt,releases}

# Copy files to Getting Started section
echo "Migrating Getting Started files..."
cp -r docs/faq-troubleshooting/* docs/getting-started/faq-troubleshooting/ 2>/dev/null || true
cp -r docs/setup/* docs/getting-started/setup/ 2>/dev/null || true
cp -r docs/deployment/* docs/getting-started/deployment/ 2>/dev/null || true
cp -r docs/getting-started/* docs/getting-started/ 2>/dev/null || true

# Copy files to Architecture section
echo "Migrating Architecture files..."
cp -r docs/architecture/* docs/architecture/ 2>/dev/null || true
cp -r docs/database/* docs/architecture/database/ 2>/dev/null || true
cp -r docs/api/* docs/architecture/api/ 2>/dev/null || true
cp -r docs/state-management/* docs/architecture/state-management/ 2>/dev/null || true
cp -r docs/security/* docs/architecture/security/ 2>/dev/null || true
cp -r docs/performance/* docs/architecture/performance/ 2>/dev/null || true

# Copy files to Development section
echo "Migrating Development files..."
cp -r docs/coding-standards/* docs/development/coding-standards/ 2>/dev/null || true
cp -r docs/naming-standards/* docs/development/naming-standards/ 2>/dev/null || true
cp -r docs/testing/* docs/development/testing/ 2>/dev/null || true
cp -r docs/error-handling/* docs/development/error-handling/ 2>/dev/null || true
cp -r docs/ci-cd/* docs/development/ci-cd/ 2>/dev/null || true
cp -r docs/code-review/* docs/development/code-review/ 2>/dev/null || true
cp -r docs/development/* docs/development/ 2>/dev/null || true

# Copy files to Features section
echo "Migrating Features files..."
cp -r docs/components/* docs/features/components/ 2>/dev/null || true
cp -r docs/application-definition/* docs/features/application-definition/ 2>/dev/null || true

# Copy files to Project Management section
echo "Migrating Project Management files..."
cp -r docs/documentation-standards/* docs/project-management/documentation-standards/ 2>/dev/null || true
cp -r docs/templates/* docs/project-management/templates/ 2>/dev/null || true
cp -r docs/enhancements/* docs/project-management/enhancements/ 2>/dev/null || true
cp -r docs/accessibility/* docs/project-management/accessibility/ 2>/dev/null || true

echo "Migration complete!"
echo ""
echo "Next steps:"
echo "1. Review the migrated files to ensure everything transferred correctly"
echo "2. Update internal links in documentation files"
echo "3. Test all documentation links"
echo "4. Once verified, remove the old directory structure" 