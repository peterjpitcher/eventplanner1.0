# Event Planner Documentation Structure
*Last updated: 25 March 2024 - 09:40 UTC*

## Overview

This document outlines the directory structure for all Event Planner documentation. It provides guidelines on where to place different types of documentation and how to maintain the documentation hierarchy.

## Root Structure

```
docs/
├── architecture/       # System architecture documentation
├── development/        # Development guides and standards
├── features/           # Feature-specific documentation
├── getting-started/    # Onboarding and quick start guides
├── project-management/ # Project management documentation
└── README.md           # Documentation overview
```

## Documentation Directory Details

### Architecture

Contains documentation related to the system's architecture, including:
- System overview diagrams
- Component relationships
- Technical decision records
- Infrastructure documentation

### Development

Contains guides and standards for developers, including:
- Coding standards
- Development environment setup
- Testing procedures
- CI/CD pipeline documentation

### Features

Contains detailed documentation for each feature:
- User guides
- Feature capabilities and limitations
- Configuration options
- Example use cases

### Getting Started

Contains onboarding materials and quick start guides:
- Installation guides
- Basic usage tutorials
- FAQ documents
- Troubleshooting guides

### Project Management

Contains all project management related documentation:
- Development workflow
- Enhancement checklists
- Templates for project documents
  - Enhancement proposals
  - Technical specifications
  - Implementation progress tracking
  - Testing notes
  - Release summaries

## Documentation Maintenance Guidelines

1. **File Locations**: Always place documentation in the appropriate directory according to its content type.

2. **Timestamps**: All documentation should include a "Last updated" timestamp at the top of the file.

3. **Versioning**: When updating existing documentation, increment any version numbers if applicable.

4. **Cross-referencing**: Use relative links when referencing other documentation files.

5. **Templates**: Use the established templates in `project-management/templates/` for all new project documentation.

6. **File Naming**: Use kebab-case for file names (e.g., `getting-started-guide.md`).

7. **Directory Structure**: Maintain the established directory structure. If a new category is needed, consult with the team before creating it.

## Git Workflow for Documentation

1. Always commit documentation changes separately from code changes.
2. Use descriptive commit messages for documentation updates.
3. Ensure all documentation changes are pushed to the main branch.
4. Review documentation changes as part of the normal code review process.

---

By following these guidelines, we ensure that our documentation remains organized, up-to-date, and valuable to all team members. 