import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// More explicit debugging to help diagnose issues
console.log(`Supabase URL is ${supabaseUrl ? 'set' : 'missing'}`);
console.log(`Supabase Anon Key is ${supabaseAnonKey ? 'set' : 'missing'}`);

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
  : createClient(supabaseUrl, supabaseAnonKey);

// Export a flag that indicates whether we're using mock data
export const isMockMode = useMockData;

// Export the environment variable values directly (without the actual values for security)
// This helps with debugging
export const supabaseStatus = {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isMockMode
}; 