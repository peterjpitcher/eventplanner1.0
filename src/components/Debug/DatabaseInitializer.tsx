import React, { useState } from 'react';
import { supabase, isMockMode } from '../../services/supabase';

const DatabaseInitializer: React.FC = () => {
  // Don't render in production environments or when using mock data
  if (process.env.NODE_ENV === 'production' || isMockMode) {
    return null;
  }
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#1F2937',
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    width: '300px',
    fontSize: '0.875rem'
  };
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.75rem'
  };
  
  const resultStyle: React.CSSProperties = {
    marginTop: '0.5rem',
    backgroundColor: '#374151',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    maxHeight: '100px',
    overflow: 'auto',
    fontSize: '0.75rem',
    whiteSpace: 'pre-wrap'
  };
  
  // Helper to create sample categories
  const createSampleCategories = async () => {
    try {
      setLoading(true);
      setResult('');
      
      // Sample categories
      const categories = [
        { name: 'Wedding', default_capacity: 100, default_start_time: '14:00' },
        { name: 'Corporate', default_capacity: 50, default_start_time: '09:00' },
        { name: 'Birthday', default_capacity: 30, default_start_time: '18:00' },
        { name: 'Conference', default_capacity: 150, default_start_time: '10:00' }
      ];
      
      const { data, error } = await supabase
        .from('event_categories')
        .insert(categories)
        .select();
      
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
  
  // Helper to create sample customers
  const createSampleCustomers = async () => {
    try {
      setLoading(true);
      setResult('');
      
      // Sample customers
      const customers = [
        { first_name: 'John', last_name: 'Doe', mobile_number: '+14155552671' },
        { first_name: 'Jane', last_name: 'Smith', mobile_number: '+14155552672' },
        { first_name: 'Robert', last_name: 'Johnson', mobile_number: '+14155552673' },
        { first_name: 'Emily', last_name: 'Williams', mobile_number: '+14155552674' }
      ];
      
      const { data, error } = await supabase
        .from('customers')
        .insert(customers)
        .select();
      
      if (error) {
        throw error;
      }
      
      setResult(`Successfully created ${data.length} customers:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Error creating customers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to create sample events
  const createSampleEvents = async () => {
    try {
      setLoading(true);
      setResult('');
      
      // Get categories first
      const { data: categories, error: categoryError } = await supabase
        .from('event_categories')
        .select('id')
        .limit(4);
      
      if (categoryError) {
        throw categoryError;
      }
      
      if (!categories || categories.length === 0) {
        throw new Error('No categories found. Please create categories first.');
      }
      
      // Sample events with existing category IDs
      const events = [
        {
          name: 'Summer Wedding',
          category_id: categories[0]?.id,
          capacity: 80,
          start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          notes: 'Outdoor venue'
        },
        {
          name: 'Tech Conference',
          category_id: categories[3]?.id || categories[0]?.id,
          capacity: 120,
          start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
          notes: 'Requires AV setup'
        },
        {
          name: 'Birthday Party',
          category_id: categories[2]?.id || categories[0]?.id,
          capacity: 25,
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          notes: 'Cake and decorations needed'
        }
      ];
      
      const { data, error } = await supabase
        .from('events')
        .insert(events)
        .select();
      
      if (error) {
        throw error;
      }
      
      setResult(`Successfully created ${data.length} events:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Error creating events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to create sample bookings
  const createSampleBookings = async () => {
    try {
      setLoading(true);
      setResult('');
      
      // Get customers and events
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .limit(4);
      
      if (customerError) {
        throw customerError;
      }
      
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id')
        .limit(3);
      
      if (eventError) {
        throw eventError;
      }
      
      if (!customers || customers.length === 0) {
        throw new Error('No customers found. Please create customers first.');
      }
      
      if (!events || events.length === 0) {
        throw new Error('No events found. Please create events first.');
      }
      
      // Sample bookings
      const bookings = [
        {
          customer_id: customers[0]?.id,
          event_id: events[0]?.id,
          attendees: 2,
          notes: 'Vegetarian meal required'
        },
        {
          customer_id: customers[1]?.id,
          event_id: events[0]?.id,
          attendees: 4,
          notes: 'Table near stage'
        },
        {
          customer_id: customers[2]?.id,
          event_id: events[1]?.id,
          attendees: 1,
          notes: ''
        },
        {
          customer_id: customers[3]?.id || customers[0]?.id,
          event_id: events[2]?.id || events[0]?.id,
          attendees: 3,
          notes: 'Special needs accessibility'
        }
      ];
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookings)
        .select();
      
      if (error) {
        throw error;
      }
      
      setResult(`Successfully created ${data.length} bookings:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Error creating bookings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Check database connection
  const checkConnection = async () => {
    try {
      setLoading(true);
      setResult('');
      
      // Step 1: Check basic connection
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
      
      // Step 2: Check write permissions for each table
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
        
        if (categoryError) {
          resultText += `❌ Cannot insert to event_categories: ${categoryError.message}\n`;
        } else {
          resultText += `✅ Can insert to event_categories\n`;
          
          // Clean up the test data
          if (categoryData?.id) {
            const { error: deleteError } = await supabase
              .from('event_categories')
              .delete()
              .eq('id', categoryData.id);
            
            if (deleteError) {
              resultText += `⚠️ Could not delete test category: ${deleteError.message}\n`;
            } else {
              resultText += `✅ Can delete from event_categories\n`;
            }
          }
        }
      } catch (e: any) {
        resultText += `❌ Error testing event_categories: ${e.message}\n`;
      }
      
      // Test customers
      try {
        const testCustomer = { 
          first_name: 'TEST', 
          last_name: 'PERMISSION', 
          mobile_number: '+11111111111' 
        };
        
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert(testCustomer)
          .select()
          .single();
        
        if (customerError) {
          resultText += `❌ Cannot insert to customers: ${customerError.message}\n`;
        } else {
          resultText += `✅ Can insert to customers\n`;
          
          // Clean up the test data
          if (customerData?.id) {
            const { error: deleteError } = await supabase
              .from('customers')
              .delete()
              .eq('id', customerData.id);
            
            if (deleteError) {
              resultText += `⚠️ Could not delete test customer: ${deleteError.message}\n`;
            } else {
              resultText += `✅ Can delete from customers\n`;
            }
          }
        }
      } catch (e: any) {
        resultText += `❌ Error testing customers: ${e.message}\n`;
      }
      
      // Add Supabase connection info
      resultText += '\nSupabase Connection Info:\n';
      resultText += `URL: ${process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Missing'}\n`;
      resultText += `API Key: ${process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}\n`;
      resultText += `Mock Mode: ${isMockMode ? 'Enabled' : 'Disabled'}\n`;
      
      setResult(resultText);
    } catch (error: any) {
      setResult(`Error checking connection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 0.5rem' }}>Supabase Data Initializer</h3>
      
      <div>
        <button 
          style={buttonStyle} 
          onClick={checkConnection}
          disabled={loading}
        >
          Check Connection
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={createSampleCategories}
          disabled={loading}
        >
          Add Categories
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={createSampleCustomers}
          disabled={loading}
        >
          Add Customers
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={createSampleEvents}
          disabled={loading}
        >
          Add Events
        </button>
        
        <button 
          style={buttonStyle} 
          onClick={createSampleBookings}
          disabled={loading}
        >
          Add Bookings
        </button>
      </div>
      
      {loading && <div>Loading...</div>}
      
      {result && (
        <div style={resultStyle}>
          {result}
        </div>
      )}
    </div>
  );
};

export default DatabaseInitializer; 