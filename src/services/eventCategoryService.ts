import { supabase, isMockMode } from './supabase';
import { EventCategory } from '../types/database.types';

// Mock data generator for development and when Supabase is not available
class MockEventCategoryData {
  private mockCategories: EventCategory[] = [];
  
  constructor() {
    // Generate some initial mock data
    this.mockCategories = Array(8).fill(null).map((_, i) => ({
      id: String(i + 1),
      name: `Category ${i + 1}`,
      default_capacity: 50 + (i * 10),
      default_start_time: i % 2 === 0 ? '09:00' : '14:00',
      notes: i % 3 === 0 ? `Notes for category ${i + 1}` : '',
      created_at: new Date().toISOString()
    }));
  }
  
  getAllCategories(): EventCategory[] {
    return [...this.mockCategories];
  }
  
  getCategoryById(id: string): EventCategory | null {
    return this.mockCategories.find(cat => cat.id === id) || null;
  }
  
  createCategory(category: Omit<EventCategory, 'id' | 'created_at'>): EventCategory {
    const newCategory: EventCategory = {
      ...category,
      id: String(this.mockCategories.length + 1),
      created_at: new Date().toISOString()
    };
    
    this.mockCategories.push(newCategory);
    return newCategory;
  }
  
  updateCategory(id: string, updates: Partial<Omit<EventCategory, 'id' | 'created_at'>>): EventCategory {
    const index = this.mockCategories.findIndex(cat => cat.id === id);
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory = {
      ...this.mockCategories[index],
      ...updates
    };
    
    this.mockCategories[index] = updatedCategory;
    return updatedCategory;
  }
  
  deleteCategory(id: string): void {
    const index = this.mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
    }
  }
}

// Create a single instance of the mock data service
const mockCategoryService = new MockEventCategoryData();

export const eventCategoryService = {
  async getAllCategories(): Promise<EventCategory[]> {
    // In mock mode, return mock data
    if (isMockMode) {
      console.log('Using mock data for getAllCategories');
      return Promise.resolve(mockCategoryService.getAllCategories());
    }
    
    // In production mode, use Supabase
    try {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching event categories:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch categories from Supabase:', error);
      // Fall back to mock data on error
      return mockCategoryService.getAllCategories();
    }
  },
  
  async getCategoryById(id: string): Promise<EventCategory | null> {
    // In mock mode, return mock data
    if (isMockMode) {
      console.log(`Using mock data for getCategoryById: ${id}`);
      return Promise.resolve(mockCategoryService.getCategoryById(id));
    }
    
    // In production mode, use Supabase
    try {
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
    } catch (error) {
      console.error(`Failed to fetch category ${id} from Supabase:`, error);
      // Fall back to mock data on error
      return mockCategoryService.getCategoryById(id);
    }
  },
  
  async createCategory(category: Omit<EventCategory, 'id' | 'created_at'>): Promise<EventCategory> {
    // In mock mode, use mock data
    if (isMockMode) {
      console.log('Using mock data for createCategory');
      return Promise.resolve(mockCategoryService.createCategory(category));
    }
    
    // In production mode, use Supabase
    try {
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
    } catch (error) {
      console.error('Failed to create category in Supabase:', error);
      // Fall back to mock data on error
      return mockCategoryService.createCategory(category);
    }
  },
  
  async updateCategory(id: string, updates: Partial<Omit<EventCategory, 'id' | 'created_at'>>): Promise<EventCategory> {
    // In mock mode, use mock data
    if (isMockMode) {
      console.log(`Using mock data for updateCategory: ${id}`);
      return Promise.resolve(mockCategoryService.updateCategory(id, updates));
    }
    
    // In production mode, use Supabase
    try {
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
    } catch (error) {
      console.error(`Failed to update category ${id} in Supabase:`, error);
      // Fall back to mock data on error
      return mockCategoryService.updateCategory(id, updates);
    }
  },
  
  async deleteCategory(id: string): Promise<void> {
    // In mock mode, use mock data
    if (isMockMode) {
      console.log(`Using mock data for deleteCategory: ${id}`);
      mockCategoryService.deleteCategory(id);
      return Promise.resolve();
    }
    
    // In production mode, use Supabase
    try {
      const { error } = await supabase
        .from('event_categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting event category with id ${id}:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Failed to delete category ${id} from Supabase:`, error);
      // Fall back to mock data on error
      mockCategoryService.deleteCategory(id);
    }
  }
}; 