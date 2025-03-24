import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Determine if we should use the real Supabase client or a mock version
const useMockData = !supabaseUrl || !supabaseAnonKey;

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