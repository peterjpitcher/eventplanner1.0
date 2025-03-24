# Mock Data System

This document explains the mock data system implemented in the Event Planner application, which allows for development and testing without requiring a Supabase connection.

## Overview

The mock data system provides in-memory data storage and realistic sample data for all application entities (customers, events, event categories, bookings). It automatically activates when:

1. Supabase environment variables are missing
2. Supabase credentials are invalid
3. Supabase connection attempts fail

## Architecture

The mock data system consists of several key components:

1. **Supabase Service** (`src/services/supabase.ts`): Handles connection detection and mock client creation
2. **Entity Services**: Each entity has its own service with dual-mode implementation
3. **Mock Data Classes**: Each service contains a private class for generating and managing mock data

### Component Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│  supabase.ts        │       │  Entity Services    │
│  - Connection logic │◄─────►│  - customerService  │
│  - Mock detection   │       │  - eventService     │
│  - Mock client      │       │  - bookingService   │
└─────────────────────┘       │  - categoryService  │
                              └─────────────────────┘
                                        ▲
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │  Mock Data Classes  │
                              │  - MockCustomerData │
                              │  - MockEventData    │
                              │  - MockBookingData  │
                              │  - MockCategoryData │
                              └─────────────────────┘
```

## Implementation

### Mock Mode Detection

The application checks for valid Supabase credentials during initialization:

```typescript
// From src/services/supabase.ts
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const useMockData = !supabaseUrl || !supabaseAnonKey;

// Export flag for services to use
export const isMockMode = useMockData;
```

### Mock Supabase Client

When in mock mode, a simplified Supabase client is created:

```typescript
const createMockClient = (): SupabaseClient => {
  console.warn('Using mock Supabase client. Data operations will use local mock data only.');
  
  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: { id: 'mock-id' }, error: null }),
      update: () => ({ data: {}, error: null }),
      delete: () => ({ data: {}, error: null }),
      eq: () => ({ single: () => ({ data: {}, error: null }) }),
    }),
    auth: {
      // Auth mock methods...
    },
  } as unknown as SupabaseClient;
};

// Export either the real client or mock client
export const supabase = useMockData 
  ? createMockClient() 
  : (supabaseInstance || createMockClient());
```

### Mock Data Generation

Each entity service contains a private class that generates and manages realistic mock data:

```typescript
// Example from customerService.ts
class MockCustomerData {
  private customers: Customer[] = [];
  private nextId: number = 1;
  
  constructor() {
    // Generate initial mock customers
    this.generateMockCustomers();
  }
  
  private generateMockCustomers(): void {
    // Clear existing data
    this.customers = [];
    
    // Generate 15 mock customers with realistic data
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
  
  // CRUD operations for this entity
  getAllCustomers(): Customer[] { /* ... */ }
  getCustomerById(id: string): Customer | null { /* ... */ }
  createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Customer { /* ... */ }
  updateCustomer(id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>): Customer { /* ... */ }
  deleteCustomer(id: string): void { /* ... */ }
  searchCustomers(query: string): Customer[] { /* ... */ }
}
```

### Dual-Mode Service Methods

Each service method checks if it should use mock data or Supabase:

```typescript
export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    if (isMockMode) {
      console.info('Using mock customer data instead of Supabase');
      return mockCustomerData.getAllCustomers();
    }
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching customers from Supabase:', error);
        console.info('Falling back to mock customer data');
        return mockCustomerData.getAllCustomers();
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching customers from Supabase:', err);
      console.info('Falling back to mock customer data');
      return mockCustomerData.getAllCustomers();
    }
  },
  
  // Additional service methods...
};
```

### Entity Relationships

The mock data system maintains proper relationships between entities:

- Events are linked to categories
- Bookings are linked to both customers and events
- Capacity constraints are respected

```typescript
// Example relation maintenance from MockEventData
private generateMockEvents(): void {
  // Generate categories first
  const categories = [
    { id: '1', name: 'Wedding', /* ... */ },
    // Additional categories...
  ];
  
  // Create events with proper category relationships
  for (let i = 0; i < 20; i++) {
    const categoryIndex = i % categories.length;
    const category = categories[categoryIndex];
    
    this.events.push({
      // Event properties...
      category_id: category.id,
      category: category,  // Include related category
      // Other properties...
    });
  }
}
```

## Benefits

The mock data system provides several advantages:

### 1. Development Without Backend

- Develop and test without requiring Supabase credentials
- Work offline without internet connection
- Isolate frontend development from backend issues

### 2. Consistent Test Data

- Realistic sample data for all entities
- Predictable relationships between entities
- Automatic generation of appropriate test scenarios

### 3. Graceful Degradation

- Automatic fallback if Supabase connection fails
- Individual service errors are contained (one failing service doesn't break others)
- Clear error logging for debugging

### 4. Fast Development Cycle

- No waiting for API responses
- Instant data operations
- Predictable data state for testing edge cases

## Switching Between Modes

To use mock mode:
1. Remove or use invalid Supabase credentials in `.env.local`
2. No configuration needed - the app automatically falls back to mock data

To use connected mode:
1. Add valid Supabase credentials to `.env.local`:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
2. Use the DatabaseInitializer component to populate your database with test data

## Logging

The mock data system includes verbose logging to help diagnose issues:

- Connection status logging during initialization
- Mock mode activation warnings
- Service method usage logging
- Fallback notifications when Supabase operations fail

## Future Enhancements

Potential improvements for the mock data system:

1. Add persistence for mock data between page refreshes (localStorage)
2. Implement network delay simulation for more realistic testing
3. Add ability to trigger specific error scenarios for testing error handling
4. Create UI for manipulating mock data generation parameters 