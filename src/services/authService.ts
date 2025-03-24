import { supabase } from './supabase';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
    
    return data;
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  },
  
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    return data.session;
  },
  
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      throw error;
    }
    
    return data.user;
  },
  
  onAuthStateChange(callback: Function) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}; 