# Contribution Guidelines

This document outlines the process for contributing to the Event Management System project. Following these guidelines helps maintain code quality and project consistency.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Getting Started

1. Ensure you have read the [Getting Started Guide](../getting-started/01-getting-started-guide.md)
2. Set up your development environment according to the [Setup Guide](../setup/02-setup-guide.md)
3. Familiarise yourself with our [Coding Standards](../coding-standards/03-coding-standards.md)

## Development Workflow

### 1. Create a Feature Branch

For all new features, bug fixes, or enhancements:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Use descriptive branch names that reflect the work being done, e.g.:
- `feature/customer-notifications`
- `bugfix/calendar-display-issue`
- `enhancement/form-validation`

### 2. Work on Your Changes

- Make focused, incremental changes
- Follow our [coding standards](../coding-standards/03-coding-standards.md)
- Write or update tests as needed
- Keep commits small and focused

### 3. Stay Updated

Regularly sync your branch with main to avoid merge conflicts:

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
```

## Commit Guidelines

We follow a modified version of Conventional Commits for clarity:

```
<type>: <description>

[optional body]

[optional footer]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code functionality (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to build process, dependencies, etc.

Examples:
```
feat: add SMS notification for event cancellations

fix: correct date formatting in event calendar

docs: update API documentation
```

## Pull Request Process

1. **Prepare Your Changes**
   - Ensure all tests pass locally
   - Update documentation if needed
   - Review your changes for code quality

2. **Create Pull Request**
   - Create a PR against the `main` branch
   - Use a clear, descriptive title
   - Include a detailed description of changes
   - Reference any related issues

3. **PR Template**
   Fill out the PR template with:
   - Purpose of changes
   - What was changed
   - How to test
   - Screenshots (if UI changes)
   - Any related issues

4. **Code Review**
   - At least one developer must approve the PR
   - Address all review comments
   - Ensure continuous integration passes

5. **Merging**
   - PRs are merged by the reviewer or PR owner after approval
   - Use "Squash and merge" to keep history clean

## Code Standards

- Follow TypeScript best practices
- Maintain 80%+ code coverage for new features
- Use ESLint and Prettier with project settings
- See [Coding Standards](../coding-standards/03-coding-standards.md) for more details

## Testing Requirements

All code contributions should include appropriate tests:

- Unit tests for services and utilities
- Component tests for UI elements
- Integration tests for critical flows
- See [Testing Guidelines](../testing/02-testing-guidelines.md) for more details

## Documentation

Update documentation alongside code changes:

- If adding new features, include documentation
- Update existing docs if changing functionality
- Add JSDoc comments to new functions/methods
- Consider updating the README if applicable

## Questions?

If you have questions about contributing:
- Ask in team communication channels
- Refer to our [FAQ](../faq-troubleshooting/02-faq-troubleshooting.md)
- Contact project maintainers 