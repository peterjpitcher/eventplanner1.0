import { supabase } from './supabase';
import { EventCategory } from '../types/database.types';

export const eventCategoryService = {
  async getAllCategories(): Promise<EventCategory[]> {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
    
    return data || [];
  },
  
  async getCategoryById(id: string): Promise<EventCategory | null> {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching event category with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async createCategory(category: Omit<EventCategory, 'id' | 'created_at'>): Promise<EventCategory> {
    const { data, error } = await supabase
      .from('event_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event category:', error);
      throw error;
    }
    
    return data;
  },
  
  async updateCategory(id: string, updates: Partial<Omit<EventCategory, 'id' | 'created_at'>>): Promise<EventCategory> {
    const { data, error } = await supabase
      .from('event_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating event category with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('event_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting event category with id ${id}:`, error);
      throw error;
    }
  }
}; 