# Event Management System

A simple, efficient web application for managing pub events, customer registrations, and bookings with SMS notifications.

## Features

- Customer registration and management
- Event category management
- Event creation and management
- Booking system with capacity control
- SMS notifications for bookings and reminders
- Clean, minimalist user interface

## Tech Stack

- Frontend: React with TypeScript
- Backend: Supabase
- Authentication: Supabase Auth
- SMS Service: Twilio
- Deployment: Vercel
- Styling: React inline styles (migrated from Tailwind CSS)

## Implementation Status

The project has completed **Phase 1 (Foundation)**, **Phase 2 (Core Functionality)**, and most of **Phase 3 (SMS & Dashboard)**, and is moving to **Phase 4 (Testing & Deployment)**. Overall completion is approximately **85%**.

### Component Status

| Component | Status | Completion % |
|-----------|--------|--------------|
| Environment Setup | ✅ COMPLETED | 100% |
| Database Implementation | ✅ COMPLETED | 100% |
| Basic UI Framework | ✅ COMPLETED | 100% |
| Customer Management | ✅ COMPLETED | 100% |
| Event Category Management | ✅ COMPLETED | 100% |
| Event Management | ✅ COMPLETED | 100% |
| Booking System | ✅ COMPLETED | 100% |
| SMS Notification System | ✅ COMPLETED | 100% |
| Dashboard | ✅ COMPLETED | 100% |
| Performance Optimization | ❌ PENDING | 0% |
| Documentation | ⚠️ PARTIAL | 60% |

For detailed implementation status, see the [Implementation Plan](./docs/enhancements/v1.0/implementation-plan.md).

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Supabase account
- Twilio account (optional for SMS functionality)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/peterjpitcher/eventplanner1.0.git
   cd event-planner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`
   - Fill in your Supabase and Twilio credentials

   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_TWILIO_ACCOUNT_SID=your-twilio-account-sid (optional)
   REACT_APP_TWILIO_AUTH_TOKEN=your-twilio-auth-token (optional)
   REACT_APP_TWILIO_PHONE_NUMBER=your-twilio-phone-number (optional)
   ```

4. Start the development server:
   ```
   npm start
   ```

## Deployment

### Deploying to Vercel

The application is configured for deployment on Vercel. Follow these steps to deploy:

1. **Create a Vercel Account**: If you don't already have one, sign up at [vercel.com](https://vercel.com).

2. **Connect to GitHub**: Connect your Vercel account to GitHub and select the repository.

3. **Configure Environment Variables**: In the Vercel dashboard, add the following environment variables:
   - `REACT_APP_SUPABASE_URL` - Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `REACT_APP_TWILIO_ACCOUNT_SID` (optional) - Your Twilio account SID
   - `REACT_APP_TWILIO_AUTH_TOKEN` (optional) - Your Twilio auth token
   - `REACT_APP_TWILIO_PHONE_NUMBER` (optional) - Your Twilio phone number

4. **Deploy**: Vercel will automatically deploy your application. Any future pushes to the main branch will trigger new deployments.

5. **Redeployment**: If you update environment variables after deployment, you need to trigger a new deployment for the changes to take effect.

### Development vs Production Mode

The application has two operating modes:

- **Development Mode**: Uses mock data for all entities (customers, events, bookings)
- **Production Mode**: Connects to Supabase for real data storage and retrieval

To use mock data, simply don't provide Supabase environment variables. To use real data, ensure all Supabase environment variables are properly configured.

## Project Structure

```
event-planner/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and external service integrations
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles and theme
├── public/             # Static assets
└── docs/               # Project documentation
    └── enhancements/   # Enhancement documentation
        └── v1.0/       # Version 1.0 documentation
```

## Next Steps

The immediate priorities for Phase 4 are:

1. Optimize application performance
2. Implement comprehensive testing
3. Set up continuous deployment pipeline
4. Add offline functionality

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**: If you see errors like "Supabase URL or Anon Key is missing", make sure:
   - Environment variables are correctly set in your `.env.local` file (development) or Vercel dashboard (production)
   - You've redeployed the application after setting environment variables
   - Your Supabase project is active and the API keys are valid

2. **Styling Issues**: The application has been migrated from Tailwind CSS to React inline styles. Any styling issues can be fixed by adjusting the CSS properties in the respective component files.

## License

This project is licensed under the MIT License.
