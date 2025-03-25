# DatabaseInitializer Component

## Overview

The DatabaseInitializer is a debug component that helps developers:

1. Verify Supabase connection status
2. Populate the Supabase database with test data
3. View schema compatibility between application and database
4. Test database operations

## When to Use

Use the DatabaseInitializer component when:

- Setting up a new Supabase project
- You need test data in your Supabase database
- Troubleshooting data connection issues
- Verifying schema changes

## Features

### Connection Verification

The component displays the current Supabase connection status:

- ✅ **Connected**: Successfully connected to Supabase
- ❌ **Not Connected**: Failed to connect to Supabase

### Data Population

One-click buttons to generate test data for:

- Customers
- Event Categories
- Events
- Bookings

### Schema Verification

The component can verify that your database schema matches the application's requirements, checking for:

- Required tables
- Required columns
- Column data types
- Foreign key relationships
- Missing fields such as the `attendees` field in bookings

## Implementation Details

### Schema Compatibility Checks

The component runs SQL scripts to verify database schema compatibility:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'bookings'
) as table_exists;

SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'bookings' 
  AND column_name = 'attendees'
) as column_exists;
```

### Data Population Strategy

When generating test data, the component follows these rules:

1. Categories are created first
2. Then customers
3. Then events (linked to categories)
4. Finally bookings (linked to customers and events)

This ensures all relationships are maintained correctly.

## Recent Updates (v1.1)

The DatabaseInitializer component has been enhanced to:

1. Check for the `attendees` field in the bookings table
2. Fix missing fields when detected
3. Display clearer error messages for schema issues
4. Better handle edge cases when populating test data

## Usage with Updated Components

Now that all application components properly use the service layer, the DatabaseInitializer becomes even more important. After populating your database with test data, the following components will automatically use that data:

- Dashboard - Displays real statistics, upcoming events, and recent bookings
- CustomerList - Shows actual customers from Supabase
- BookingList - Displays real bookings with proper relationships
- Event-related pages - Show real events with capacity tracking

## Best Practice

1. First use the DatabaseInitializer to verify your connection status
2. Add test data to your database
3. Use the application normally, and it will use your real data

If you need to reset test data, you can use Supabase's interface to clear tables and then re-populate using the DatabaseInitializer. 