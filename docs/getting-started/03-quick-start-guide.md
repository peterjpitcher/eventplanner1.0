# Quick Start Guide
This guide provides a rapid setup process for developers who want to get started quickly with the Event Management System.

## Prerequisites
- Node.js v18 or higher
- Git
- VS Code (recommended)
- Supabase account
- Twilio account

## Quick Setup Steps

### 1. Clone and Setup
```bash
# Clone the repository
git clone [repository-url]
cd event-management-system

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 2. Environment Variables
Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 3. Start Development
```bash
# Start development server
npm run dev
```

## Quick Development Guide

### Project Structure
```
src/
├── components/     # UI Components
├── pages/         # Pages
├── services/      # API Services
└── utils/         # Utilities
```

### Key Files
- `src/pages/index.tsx` - Main dashboard
- `src/components/` - Reusable components
- `src/services/` - API integrations
- `src/utils/` - Helper functions

### Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
```

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Create PR
5. Get review
6. Merge to main

## Quick Reference

### Component Creation
```typescript
// src/components/Example.tsx
import React from 'react';

interface ExampleProps {
  title: string;
}

export const Example: React.FC<ExampleProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### API Integration
```typescript
// src/services/api.ts
import { supabase } from '../utils/supabase';

export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*');
  
  if (error) throw error;
  return data;
};
```

### State Management
```typescript
// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import { getEvents } from '../services/api';

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  return events;
};
```

## Common Issues & Solutions

### 1. Environment Variables
- Ensure all required variables are set
- Restart server after changes
- Check for typos in variable names

### 2. Database Connection
- Verify Supabase credentials
- Check network connectivity
- Review database permissions

### 3. SMS Integration
- Validate Twilio credentials
- Check phone number format
- Review SMS templates

## Next Steps
1. Review [Architecture Documentation](../architecture/README.md)
2. Read [Coding Standards](../coding-standards/README.md)
3. Check [API Documentation](../api/README.md)
4. Understand [Database Schema](../database/schema.md)

## Getting Help
- Check [FAQ](../faq-troubleshooting/README.md)
- Review [Troubleshooting Guide](../faq-troubleshooting/README.md)
- Ask team members
- Create an issue 