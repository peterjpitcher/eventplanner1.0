# Supabase Integration

This document provides information about the Supabase integration in the Event Management System.

## Overview

The Event Management System uses [Supabase](https://supabase.io/) as its backend database and API service. Supabase provides a PostgreSQL database with a REST API, authentication, and real-time capabilities.

## Connection Setup

The connection to Supabase is configured in `src/services/supabase.ts`:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Use real Supabase connection
const useMockData = false;

// Create Supabase client
let supabaseInstance: SupabaseClient | null = null;
try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client created successfully.');
} catch (err) {
  console.error('Error creating Supabase client:', err);
}

// Export the Supabase client
export const supabase = supabaseInstance || createClient(supabaseUrl, supabaseAnonKey);

// Export flag for mock mode
export const isMockMode = useMockData;
```

## Environment Variables

To connect to your Supabase instance, set the following environment variables in your `.env.local` file:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Service Layer

Each entity in the application has a corresponding service file that handles data operations:

- `src/services/customerService.ts` - Customer CRUD operations
- `src/services/eventService.ts` - Event CRUD operations
- `src/services/eventCategoryService.ts` - Event Category CRUD operations
- `src/services/bookingService.ts` - Booking CRUD operations

Each service provides an abstraction layer over direct Supabase calls and includes fallback to mock data if needed:

```typescript
async getAllCategories(): Promise<EventCategory[]> {
  // In production mode, use Supabase
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch categories from Supabase:', error);
    // Fall back to mock data on error
    return mockCategoryService.getAllCategories();
  }
}
```

## Mock Data System

The application includes a comprehensive mock data system that provides realistic data for development and when Supabase is not available.

Each service contains a MockDataService class that generates and maintains in-memory data:

```typescript
class MockEventCategoryData {
  private mockCategories: EventCategory[] = [];
  
  constructor() {
    // Generate initial mock data
    this.mockCategories = [...];
  }
  
  getAllCategories(): EventCategory[] {
    return [...this.mockCategories];
  }
  
  // Other mock methods
}
```

## Database Initializer

The application includes a DatabaseInitializer component that helps with:

1. Testing the Supabase connection
2. Checking permissions for each table
3. Populating test data in Supabase

To use the DatabaseInitializer:

1. The component appears in the bottom-right corner of the application
2. Use "Check Connection" to verify your Supabase connection
3. Use "Add Categories", "Add Customers", etc. to populate test data

### Connection Check Features

The enhanced connection check (v1.1.1) provides:

- Detailed connection status information
- Table-by-table permission testing
- Verification of environment variables
- Mock mode status

## Common Issues & Troubleshooting

### Permission Errors

If you encounter permission errors (e.g., "new row violates row-level security policy"), check:

1. Your Supabase project's Row Level Security (RLS) policies
2. That your anon key has the necessary permissions
3. If necessary, temporarily disable RLS for testing:
   ```sql
   ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
   ```

### Connection Issues

If you're having trouble connecting to Supabase:

1. Verify your environment variables are correctly set
2. Check that your Supabase project is active
3. Use the DatabaseInitializer's "Check Connection" feature for diagnostics

## Database Schema

The application uses the following tables in Supabase:

- `customers` - Customer information
- `event_categories` - Event category information
- `events` - Event information
- `bookings` - Booking information

See the [Database Documentation](./05-database-overview.md) for detailed schema information.

## Supabase Features Used

The application uses the following Supabase features:

- **Database**: PostgreSQL database for storing data
- **Rest API**: For all CRUD operations
- **Row Level Security**: For controlling data access (when enabled)

## Development vs Production

In development, you can work in two modes:

1. **Connected Mode**: Using a real Supabase connection
2. **Mock Mode**: Using the built-in mock data system

To switch to Mock Mode, modify the `useMockData` flag in `supabase.ts`.

## Future Enhancements

Planned enhancements for the Supabase integration:

1. **Authentication**: Implementing user authentication with Supabase Auth
2. **Real-time Updates**: Utilizing Supabase's real-time capabilities
3. **Role-based Access Control**: Implementing RLS policies for different user roles 