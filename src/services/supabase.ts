import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Log all available environment variables (safely)
console.log('Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// More explicit debugging to help diagnose issues
console.log(`Supabase URL is ${supabaseUrl ? 'set: ' + supabaseUrl.substring(0, 15) + '...' : 'missing'}`);
console.log(`Supabase Anon Key is ${supabaseAnonKey ? 'set: ' + supabaseAnonKey.substring(0, 5) + '...' : 'missing'}`);

// Determine if we should use the real Supabase client or a mock version
const useMockData = !supabaseUrl || !supabaseAnonKey;

// Log the application mode
if (useMockData) {
  console.warn('MOCK MODE ACTIVE: Using mock data because Supabase credentials are missing or invalid.');
  
  // Make it clearer which variable is missing
  if (!supabaseUrl) console.error('REACT_APP_SUPABASE_URL is missing or empty');
  if (!supabaseAnonKey) console.error('REACT_APP_SUPABASE_ANON_KEY is missing or empty');
} else {
  console.log('PRODUCTION MODE: Connected to Supabase for real data.');
}

// Attempt to connect to Supabase even without proper environment variables
// This will help diagnose if the issue is with the Supabase connection itself
let supabaseInstance: SupabaseClient | null = null;
try {
  if (!useMockData) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully.');
    
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
    
    // Execute the test
    testConnection();
  }
} catch (err) {
  console.error('Error creating Supabase client:', err);
}

// Create a mock implementation of SupabaseClient for development without credentials
const createMockClient = (): SupabaseClient => {
  console.warn('Using mock Supabase client. Data operations will use local mock data only.');
  
  // This is a very simplified mock that allows the app to initialize
  // Individual service files will use their own mock implementations for CRUD operations
  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: { id: 'mock-id' }, error: null }),
      update: () => ({ data: {}, error: null }),
      delete: () => ({ data: {}, error: null }),
      eq: () => ({ single: () => ({ data: {}, error: null }) }),
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, session: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient;
};

// Export either the real Supabase client or the mock version
export const supabase = useMockData 
  ? createMockClient() 
  : (supabaseInstance || createMockClient());

// Export a flag that indicates whether we're using mock data
export const isMockMode = useMockData;

// Export the environment variable values directly (without the actual values for security)
// This helps with debugging
export const supabaseStatus = {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 8)}...` : 'missing',
  keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 4)}...` : 'missing',
  isMockMode
}; 