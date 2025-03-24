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

The project has completed **Phase 1 (Foundation)**, **Phase 2 (Core Functionality)**, **Phase 3 (SMS & Dashboard)**, and now **Phase 4 (Testing & Deployment)** with Supabase integration. Overall completion is approximately **95%**.

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
| Performance Optimization | ✅ COMPLETED | 100% |
| Documentation | ✅ COMPLETED | 100% |
| Supabase Integration | ✅ COMPLETED | 100% |

For detailed implementation status, see the [Implementation Plan](./docs/enhancements/v1.0/implementation-plan.md).

## Recent Updates (v1.1)

The application has been significantly improved with the following features:

1. **Full Supabase Integration**: All components now properly connect to Supabase for real data instead of using mock data.
   
2. **Data Layer Architecture**: Improved service layer that gracefully falls back to mock data if Supabase connection fails.

3. **Database Schema Fix**: Fixed missing `attendees` field in the database schema and ensured all booking records include this field.

4. **Bug Fixes**: 
   - Fixed TypeScript errors related to component props and state management
   - Enhanced error handling throughout the application
   - Improved data fetching and state management

To use the application with real data:

1. Ensure your `.env.local` file contains valid Supabase credentials
2. Use the DatabaseInitializer tool to populate your Supabase database
3. All components (Dashboard, CustomerList, BookingList, etc.) will automatically fetch and display real data

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

- **Development Mode (Mock Mode)**: Uses mock data for all entities (customers, events, bookings, event categories)
- **Production Mode (Connected Mode)**: Connects to Supabase for real data storage and retrieval

#### Mock Mode

Mock mode is automatically activated when:
- Supabase environment variables are missing
- Supabase credentials are invalid
- Supabase connection fails

Benefits:

- Develop and test without requiring a Supabase connection
- Automatic generation of realistic sample data for all entities
- All CRUD operations work with in-memory data
- Consistent mock data between page refreshes
- Relationships between entities are maintained (e.g., bookings linked to customers and events)

#### Connected Mode

When valid Supabase credentials are provided, the application connects to your Supabase database for real data storage.

#### DatabaseInitializer Component

When in Connected Mode, the application displays a **DatabaseInitializer** component in the bottom-right corner that provides:

- Database connection status verification
- One-click population of test data in your Supabase database
- Tools for adding sample:
  - Event Categories
  - Customers
  - Events
  - Bookings
- Feedback on operation results

This tool makes it easy to quickly populate your Supabase database with test data matching the application's schema.

#### Switching Between Modes

To switch between Mock and Connected modes:

1. **For Mock Mode**: 
   - Remove or use invalid Supabase credentials in your `.env.local` file
   - No configuration needed - the app automatically falls back to mock data

2. **For Connected Mode**:
   - Add valid Supabase credentials in your `.env.local` file:
     ```
     REACT_APP_SUPABASE_URL=your-supabase-project-url
     REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Use the DatabaseInitializer component to populate your database with test data

#### Graceful Fallback

The application implements a graceful fallback system:
- If Supabase connection fails for any reason, the app automatically switches to mock data
- Individual service errors are handled independently, allowing partial functionality if some Supabase tables are inaccessible

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
    ├── enhancements/   # Enhancement documentation
    │   └── v1.0/       # Version 1.0 documentation
    │       ├── README.md                 # Overview of version 1.0
    │       ├── implementation-plan.md    # Implementation plan
    │       ├── 03-data-layer.md          # Data layer documentation
    │       ├── 04-mock-data-system.md    # Mock data system documentation
    │       ├── 05-database-initializer.md # DatabaseInitializer guide
    │       └── 06-debug-components.md    # Debug components documentation
    └── other-directories/ # Other documentation categories
```

## Detailed Documentation

For more detailed information about specific aspects of the application, please refer to:

- [Implementation Plan](./docs/enhancements/v1.0/implementation-plan.md) - The phased implementation approach
- [Mock Data System](./docs/enhancements/v1.0/04-mock-data-system.md) - How the mock data system works for offline development
- [Data Layer Architecture](./docs/enhancements/v1.0/03-data-layer.md) - Technical details about the data layer implementation
- [DatabaseInitializer Guide](./docs/enhancements/v1.0/05-database-initializer.md) - How to use the DatabaseInitializer component
- [Debug Components](./docs/enhancements/v1.0/06-debug-components.md) - Technical documentation for debugging components

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

## GitHub Release Process

To create a new release on GitHub:

1. **Update Documentation**:
   - Update README.md with any new features or changes
   - Update CHANGELOG.md with version details and changes
   - Create or update RELEASE.md with release notes

2. **Tag the Release**:
   ```bash
   git add .
   git commit -m "Release v1.1.0"
   git tag -a v1.1.0 -m "Version 1.1.0"
   git push origin main
   git push origin --tags
   ```

3. **Create GitHub Release**:
   - Go to your GitHub repository
   - Navigate to "Releases"
   - Click "Draft a new release"
   - Select the tag you just pushed
   - Fill in the release title (e.g., "v1.1.0")
   - Copy the contents from RELEASE.md into the description
   - Click "Publish release"

4. **Update Deployment**:
   - If using Vercel, it will automatically deploy the new release
   - Otherwise, follow your deployment process

## License

This project is licensed under the MIT License.
