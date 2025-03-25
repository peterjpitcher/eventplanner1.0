# Debug Components

This document describes various debugging and development utility components in the Event Planner application.

## DatabaseInitializer

The `DatabaseInitializer` component (`/src/components/Debug/DatabaseInitializer.tsx`) is a developer tool that helps quickly populate a Supabase database with sample data.

### Purpose

- Simplify development and testing by providing easy database population
- Validate Supabase connectivity and configuration
- Speed up the setup process when working with a fresh database

### Visibility

The component appears as a floating panel in the bottom-right corner of the application, but **only when**:

1. The application is in Connected Mode (running with valid Supabase credentials)
2. The `isMockMode` flag is `false` (indicating proper Supabase connectivity)

### Features

- **Check Connection**: Tests connectivity to all database tables
- **Add Categories**: Creates sample event categories like Wedding, Corporate, etc.
- **Add Customers**: Creates sample customer records
- **Add Events**: Creates sample events linked to the added categories
- **Add Bookings**: Creates sample bookings linked to the added customers and events

### Sample Data

The component adds the following sample data:

#### Categories
- Wedding (capacity: 100, start time: 14:00)
- Corporate (capacity: 50, start time: 09:00)
- Birthday (capacity: 30, start time: 18:00)
- Conference (capacity: 150, start time: 10:00)

#### Customers
- John Doe (john@example.com, +14155552671)
- Jane Smith (jane@example.com, +14155552672)
- Robert Johnson (robert@example.com, +14155552673)
- Emily Williams (emily@example.com, +14155552674)

#### Events
- Summer Wedding (linked to Wedding category)
- Tech Conference (linked to Conference category)
- Birthday Party (linked to Birthday category)

#### Bookings
- Various bookings linking the sample customers to events with different attendee counts

### Implementation Details

The component uses the same Supabase client instance as the rest of the application:

```typescript
import { supabase, isMockMode, supabaseStatus } from '../../services/supabase';
```

It manages its own loading state and result feedback:

```typescript
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<string>('');
```

Each data creation function follows the same pattern:
1. Set loading state
2. Clear previous results
3. Define sample data
4. Insert data into appropriate Supabase table
5. Handle success or error cases
6. Update result state with feedback
7. Reset loading state

### Usage Recommendations

1. Use in a specific order (Categories → Customers → Events → Bookings)
2. Check the connection first to verify database access
3. Use Supabase Studio to clear tables if you encounter duplicate key errors
4. Consider disabling in production environments

### Code Snippet

Core implementation pattern:

```typescript
const createSampleCategories = async () => {
  try {
    setLoading(true);
    setResult('');
    
    // Sample data definition
    const categories = [
      { name: 'Wedding', default_capacity: 100, default_start_time: '14:00' },
      // Additional categories...
    ];
    
    // Supabase operation
    const { data, error } = await supabase
      .from('event_categories')
      .insert(categories)
      .select();
    
    // Error handling
    if (error) {
      throw error;
    }
    
    // Success feedback
    setResult(`Successfully created ${data.length} categories:\n${JSON.stringify(data, null, 2)}`);
  } catch (error: any) {
    // Error feedback
    setResult(`Error creating categories: ${error.message}`);
  } finally {
    // Reset state
    setLoading(false);
  }
};
```

### Styling

The component uses React inline styles for a compact, modern appearance:

- Fixed positioning in the bottom-right corner
- Dark background with white text for good contrast
- Compact buttons for space efficiency
- Scrollable result area for viewing operation output

### Future Enhancements

Potential improvements for this component:

1. Add ability to clear tables before adding data
2. Add progress indicators for multi-step operations
3. Make visibility configurable through environment variables
4. Add ability to customize the sample data 