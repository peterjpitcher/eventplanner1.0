# 🚀 Getting Started Guide

Welcome to the Event Management System project! This guide will help you get started with development and understanding the project structure.

## Quick Links
- [Quick Start Guide](./03-quick-start-guide.md)
- [Setup Guide](../setup/02-setup-guide.md)
- [Architecture Overview](../architecture/03-architecture-overview.md)
- [Development Process](../development/README.md)

## Project Overview
The Event Management System is a web application designed to help pub staff manage events, customer registrations, and bookings efficiently. The system includes SMS notifications for bookings and event reminders.

### Key Features
- Customer registration and management
- Event creation and management
- Booking system with capacity control
- SMS notifications for bookings and reminders
- Simple, efficient user interface

### Technical Stack
- **Frontend**: React with TypeScript
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **SMS Service**: Twilio
- **Deployment**: Vercel
- **Version Control**: GitHub

## Development Environment Setup

### Prerequisites
1. Node.js (v18 or higher)
2. Git
3. VS Code (recommended)
4. Supabase CLI
5. Twilio account (for SMS functionality)

### Initial Setup
1. Clone the repository
   ```bash
   git clone [repository-url]
   cd event-management-system
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure
```
event-management-system/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and external service integrations
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── styles/        # Global styles and theme
├── public/            # Static assets
├── docs/             # Project documentation
└── tests/            # Test files
```

## Development Workflow

### 1. Local Development
- Work on features in feature branches
- Follow the [Coding Standards](../coding-standards/README.md)
- Write tests for new features
- Update documentation as needed

### 2. Testing
- Run tests locally before committing
- Ensure all tests pass
- Follow [Testing Guidelines](../testing/README.md)

### 3. Code Review
- Create pull requests for review
- Follow [Code Review Process](../code-review/README.md)
- Address review comments
- Merge after approval

### 4. Deployment
- Changes are deployed to Vercel
- Preview deployments for pull requests
- Production deployment after approval

## Common Tasks

### Creating a New Feature
1. Create a feature branch
2. Implement the feature
3. Write tests
4. Update documentation
5. Create pull request
6. Address review comments
7. Merge to main

### Updating Documentation
1. Follow [Documentation Standards](../documentation-standards/README.md)
2. Update relevant sections
3. Review changes
4. Submit for review

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- [filename]
```

## Getting Help
- Check the [FAQ](../faq-troubleshooting/README.md)
- Review relevant documentation
- Ask team members
- Create an issue if needed

## Next Steps
1. Review the [Architecture Documentation](../architecture/README.md)
2. Familiarize yourself with [State Management](../state-management/README.md)
3. Understand the [Database Schema](../database/schema.md)
4. Learn about [API Integration](../api/README.md)

## Contributing
- Follow the [Development Process](../development/README.md)
- Adhere to [Coding Standards](../coding-standards/README.md)
- Update documentation as needed
- Participate in code reviews

## Support
For additional support:
- Check the [Troubleshooting Guide](../faq-troubleshooting/README.md)
- Review the [Runbook](../operations/runbook.md)
- Contact the development team 