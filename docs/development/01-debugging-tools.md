# Debugging Tools

This document outlines the debugging tools available in the Event Management System.

## Overview

The Event Management System includes several built-in debugging tools to help developers identify and fix issues, particularly with Supabase connectivity and data operations.

## DatabaseInitializer

The most comprehensive debugging tool is the DatabaseInitializer component located at `src/components/Debug/DatabaseInitializer.tsx`.

### Location and Access

The DatabaseInitializer appears as a floating panel in the bottom-right corner of the application in both development and production environments.

### Features

The DatabaseInitializer provides the following features:

#### Connection Check

The "Check Connection" button performs a comprehensive check of the Supabase connection, including:

- Basic connectivity test
- Environment variable verification
- Write permission testing for each table
- Mock mode status

Example output:

```
✅ Connected to Supabase
📊 Found 4 customers

Testing write permissions:
✅ Can insert to event_categories
✅ Can delete from event_categories
✅ Can insert to customers
✅ Can delete from customers

Supabase Connection Info:
URL: Set
API Key: Set
Mock Mode: Disabled
```

#### Sample Data Creation

Buttons for populating test data:

- "Add Categories" - Creates sample event categories
- "Add Customers" - Creates sample customers
- "Add Events" - Creates sample events (requires categories)
- "Add Bookings" - Creates sample bookings (requires customers and events)

Each operation provides detailed feedback in the result panel, including success or error messages with counts of records created.

### Implementation

The DatabaseInitializer uses direct Supabase calls rather than the service layer to provide more direct feedback on database operations.

```typescript
// Example of the enhanced checkConnection function in v1.1.1
const checkConnection = async () => {
  try {
    setLoading(true);
    setResult('');
    
    // Basic connection check
    const { count, error: connectionError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    let resultText = '';
    
    if (connectionError) {
      resultText += `❌ Connection error: ${connectionError.message}\n`;
    } else {
      resultText += `✅ Connected to Supabase\n`;
      resultText += `📊 Found ${count} customers\n`;
    }
    
    // Permission testing
    resultText += '\nTesting write permissions:\n';
    
    // Test categories
    try {
      const testCategory = { 
        name: 'TEST PERMISSION', 
        default_capacity: 1, 
        default_start_time: '00:00',
        notes: 'This is a test category - will be deleted'
      };
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('event_categories')
        .insert(testCategory)
        .select()
        .single();
      
      // ...additional code for testing and cleanup
    }
    
    // ...additional tests
    
    setResult(resultText);
  } catch (error: any) {
    setResult(`Error checking connection: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

## Console Logging

The application includes extensive console logging for debugging:

### Supabase Connection Logging

In `src/services/supabase.ts`, the Supabase connection process is logged:

```typescript
// Log all available environment variables
console.log('Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

// More explicit debugging to help diagnose issues
console.log(`Supabase URL is ${supabaseUrl ? 'set: ' + supabaseUrl.substring(0, 15) + '...' : 'missing'}`);
console.log(`Supabase Anon Key is ${supabaseAnonKey ? 'set: ' + supabaseAnonKey.substring(0, 5) + '...' : 'missing'}`);

// Test the connection with async function
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
```

### Service Layer Logging

Each service file includes detailed logging for data operations:

```typescript
async createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
  try {
    console.log('Creating customer:', customerData);
    
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer in Supabase:', error);
      throw error;
    }
    
    console.log('Successfully created customer:', data);
    return data;
  } catch (error) {
    console.error('Failed to create customer:', error);
    // Fall back to mock data on error
    return mockCustomerService.createCustomer(customerData);
  }
}
```

## Form Validation Debugging

Form components include detailed validation logging:

```typescript
const validateForm = (): boolean => {
  console.log('Validating form data:', formData);
  
  if (!formData.first_name.trim()) {
    console.warn('Validation failed: First name is required');
    setError('First name is required');
    return false;
  }
  
  // Additional validation rules
  
  console.log('Form validation passed');
  return true;
};
```

## Using the Browser Console for Debugging

For the most comprehensive debugging information:

1. Open your browser's developer tools (F12 or right-click > Inspect)
2. Navigate to the Console tab
3. Look for log messages, warnings, and errors

Important messages to look for:

- "Supabase URL is set/missing" - Environment variable status
- "Successfully connected to Supabase" - Connection success
- "Failed to connect to Supabase" - Connection failure
- "Error creating/updating/deleting" - Operation errors

## Common Problems & Solutions

### Permission Errors

Problem: "Error creating event category: new row violates row-level security policy"

Solution:
1. Use the DatabaseInitializer to check connection and permissions
2. In Supabase dashboard, disable or modify RLS policies
3. See the [Supabase Integration](../database/06-supabase-integration.md) document for details

### Mock Data Fallback

Problem: Real data operations fail but no errors appear in the UI

Solution:
1. Check the console for detailed error logs
2. Verify the application isn't silently falling back to mock data
3. Use the DatabaseInitializer's connection check to verify permissions

## Conclusion

The debugging tools in the Event Management System provide comprehensive visibility into the application's data operations and connectivity status. Using these tools will help identify and resolve issues quickly during development and production. 