# Event Planner Data Layer

This document provides technical details about the Event Planner application's data layer implementation, including the mock data system, Supabase integration, and the DatabaseInitializer component.

## Data Layer Architecture

## Overview

The Event Planner application uses a dual-mode data layer architecture that transparently switches between Supabase and mock data depending on connection availability.

## Architecture

### Service Layer

Each entity in the system has a dedicated service:

- `customerService` - Customer operations
- `eventService` - Event operations
- `eventCategoryService` - Event category operations
- `bookingService` - Booking operations
- `smsService` - SMS notifications

### Key Features

1. **Transparent Fallback**: Services automatically attempt to use Supabase, but gracefully fall back to mock data if:
   - Supabase credentials are missing
   - Connection fails
   - Operations encounter errors

2. **Consistent API**: All services expose the same methods regardless of data mode:
   - `getAll[Entity]()` - Retrieves all entities
   - `get[Entity](id)` - Retrieves entity by ID
   - `create[Entity](data)` - Creates new entity
   - `update[Entity](id, data)` - Updates existing entity
   - `delete[Entity](id)` - Deletes entity

3. **Relationship Handling**: Services handle entity relationships
   - Bookings include customer and event data
   - Events include category data
   - Mock data maintains consistent relationships

## Implementation

### Recent Update (v1.1)

All components in the application now properly use the service layer instead of hardcoded mock data:

- `Dashboard.tsx` - Uses all services to display stats, upcoming events, and recent bookings
- `CustomerList.tsx` - Uses customerService for displaying and searching customers
- `BookingList.tsx` - Uses bookingService for displaying bookings
- `SMSNotifications.tsx` - Uses customerService, eventService and smsService

This ensures that all components work with real Supabase data when available, and gracefully fall back to mock data when needed.

### Connection Status Detection

The data layer checks Supabase connection status:

```typescript
// Check if Supabase is available and credentials exist
const checkSupabaseAvailability = async () => {
  const { data: test, error } = await supabase
    .from('customers')
    .select('count(*)', { count: 'exact' })
    .limit(1);

  return !error;
};
```

### Service Pattern

Each service follows a consistent pattern:

```typescript
export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      // Try Supabase first
      if (await checkSupabaseAvailability()) {
        const { data, error } = await supabase
          .from('customers')
          .select('*');
          
        if (!error) {
          return data;
        }
      }
      
      // Fall back to mock data if needed
      return generateMockCustomers();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return generateMockCustomers();
    }
  },
  
  // Other methods follow the same pattern...
};
```

## Advantages

1. **Resilience**: The application continues to function even if Supabase is unavailable
2. **Seamless Development**: Developers can work without Supabase credentials
3. **Data Consistency**: Mock data maintains relationships between entities
4. **Production-Ready**: Transparently uses real data in production without code changes

## Supabase Integration

### Connection Setup

The Supabase client is initialized in `src/services/supabase.ts` with environment variables:

```typescript
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
```

The application automatically detects if credentials are missing:

```typescript
const useMockData = !supabaseUrl || !supabaseAnonKey;
```

### Connection Testing

On initialization, the application tests the Supabase connection:

```typescript
try {
  if (!useMockData) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    
    const testConnection = async () => {
      try {
        const response = await supabaseInstance!.from('customers').select('count', { count: 'exact', head: true });
        if (response.error) {
          console.error('Failed to connect to Supabase:', response.error.message);
        } else {
          console.log(`Successfully connected to Supabase! Found ${response.count} customers.`);
        }
      } catch (error: any) {
        console.error('Error testing Supabase connection:', error.message);
      }
    };
    
    testConnection();
  }
} catch (err) {
  console.error('Error creating Supabase client:', err);
}
```

### Mock Client Fallback

A mock Supabase client is provided for development without credentials:

```typescript
const createMockClient = (): SupabaseClient => {
  console.warn('Using mock Supabase client. Data operations will use local mock data only.');
  
  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      // Additional mock methods...
    }),
    // Additional mock properties...
  } as unknown as SupabaseClient;
};
```

## Service Layer Implementation

Each entity type (customers, events, event categories, bookings) has a dedicated service that:

1. Implements both mock and real data handling
2. Provides a consistent API regardless of data source
3. Handles failures gracefully with automatic fallback to mock data

### Service Structure Example

Each service follows a similar pattern:

```typescript
// 1. Mock data class for in-memory data management
class MockCustomerData {
  private customers: Customer[] = [];
  
  // Mock data operations
  getAllCustomers(): Customer[] { /* ... */ }
  getCustomerById(id: string): Customer | null { /* ... */ }
  // Additional methods...
}

// 2. Single instance of the mock data handler
const mockCustomerData = new MockCustomerData();

// 3. Exported service with dual-mode operations
export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    // Check if using mock mode
    if (isMockMode) {
      console.info('Using mock customer data instead of Supabase');
      return mockCustomerData.getAllCustomers();
    }
    
    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      // Handle Supabase errors
      if (error) {
        console.error('Error fetching customers from Supabase:', error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.getAllCustomers();
      }
      
      return data || [];
    } catch (err) {
      // Fall back to mock data on exception
      console.error('Exception fetching customers from Supabase:', err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.getAllCustomers();
    }
  },
  
  // Additional service methods...
};
```

## Mock Data Implementation

### Mock Data Generation

Each service generates realistic mock data on initialization:

```typescript
private generateMockCustomers(): void {
  // Clear existing data
  this.customers = [];
  
  // Generate 15 mock customers
  const firstNames = ['John', 'Jane', 'Michael', /* ... */];
  const lastNames = ['Smith', 'Johnson', 'Williams', /* ... */];
  
  for (let i = 0; i < 15; i++) {
    const id = this.nextId++;
    this.customers.push({
      id: id.toString(),
      first_name: firstNames[i % firstNames.length],
      last_name: lastNames[i % lastNames.length],
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
      mobile_number: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
      notes: i % 3 === 0 ? 'VIP customer' : i % 3 === 1 ? 'Prefers email contact' : '',
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }
}
```

### Entity Relationships

Mock data maintains relationships between entities:

```typescript
// Generate event with linked categories
generateMockEvents(): void {
  // Generate categories first
  const categories = [
    { id: '1', name: 'Wedding', /* ... */ },
    // Additional categories...
  ];
  
  // Generate events linked to categories
  for (let i = 0; i < 20; i++) {
    // Select a category for this event
    const categoryIndex = i % categories.length;
    const category = categories[categoryIndex];
    
    // Create event with proper relationship
    this.events.push({
      id: id.toString(),
      name: `${eventName} ${id}`,
      category_id: category.id,
      // Additional properties...
      category: category,  // Include the related category
      bookings: bookings   // Include related bookings
    });
  }
}
```

## DatabaseInitializer Component

The `DatabaseInitializer` component (`src/components/Debug/DatabaseInitializer.tsx`) provides a user interface for:

1. Testing Supabase connectivity
2. Populating the database with sample data
3. Verifying data operations

### Component Visibility

The component only appears in connected mode:

```typescript
// Only show in production mode and when not using mock data
if (isMockMode) {
  return null;
}
```

### Database Population Functions

Sample implementation for adding test data:

```typescript
const createSampleCategories = async () => {
  try {
    setLoading(true);
    setResult('');
    
    // Sample categories
    const categories = [
      { name: 'Wedding', default_capacity: 100, default_start_time: '14:00' },
      // Additional categories...
    ];
    
    const { data, error } = await supabase
      .from('event_categories')
      .insert(categories)
      .select();
    
    // Handle results
    if (error) {
      throw error;
    }
    
    setResult(`Successfully created ${data.length} categories:\n${JSON.stringify(data, null, 2)}`);
  } catch (error: any) {
    setResult(`Error creating categories: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

### Database Connection Checking

The component can verify connectivity to all tables:

```typescript
const checkConnection = async () => {
  try {
    setLoading(true);
    setResult('');
    
    // Test each table
    const tables = ['customers', 'event_categories', 'events', 'bookings'];
    const results = [];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results.push(`${table}: ERROR - ${error.message}`);
      } else {
        results.push(`${table}: ${count} records`);
      }
    }
    
    setResult(`Database connection check:\n${results.join('\n')}`);
  } catch (error: any) {
    setResult(`Connection error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

## Best Practices and Notes

1. **Error Handling**: All service methods catch and log errors, providing graceful fallback to mock data
2. **Logging**: Verbose logging helps diagnose connection issues in both modes
3. **Consistency**: Service APIs remain identical regardless of data source
4. **Independence**: Services can operate independently, allowing partial functionality if some tables are unavailable
5. **Testing**: The dual-mode architecture facilitates testing without a real database
6. **Development**: Developers can work without Supabase credentials while maintaining full functionality 