import { supabase } from './supabase';

export const eventService = {
  getAllEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        bookings:bookings(*)
      `)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data || [];
  },

  getEventById: async (id: string) => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        bookings:bookings(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },

  getUpcomingEvents: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        bookings:bookings(*)
      `)
      .gte('start_time', today.toISOString())
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
    
    return data || [];
  },

  getEventsByCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        bookings:bookings(*)
      `)
      .eq('category_id', categoryId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error(`Error fetching events for category ${categoryId}:`, error);
      throw error;
    }
    
    return data || [];
  },

  createEvent: async (eventData: any) => {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    return data?.[0];
  },

  updateEvent: async (id: string, eventData: any) => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating event with id ${id}:`, error);
      throw error;
    }
    
    return data?.[0];
  },

  deleteEvent: async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      throw error;
    }
  }
}; 