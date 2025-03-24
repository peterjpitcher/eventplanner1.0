import { supabase, isMockMode } from './supabase';
import { Event, EventWithRelations } from '../types/database.types';

// Mock data handler for development without Supabase connection
class MockEventData {
  private events: EventWithRelations[] = [];
  private nextId: number = 1;
  
  constructor() {
    // Generate initial mock events
    this.generateMockEvents();
  }
  
  private generateMockEvents(): void {
    // Clear existing data
    this.events = [];
    
    // Generate categories first
    const categories = [
      { id: '1', name: 'Wedding', default_capacity: 100, default_start_time: '14:00', created_at: new Date().toISOString() },
      { id: '2', name: 'Corporate', default_capacity: 50, default_start_time: '09:00', created_at: new Date().toISOString() },
      { id: '3', name: 'Birthday', default_capacity: 30, default_start_time: '18:00', created_at: new Date().toISOString() },
      { id: '4', name: 'Conference', default_capacity: 150, default_start_time: '10:00', created_at: new Date().toISOString() }
    ];
    
    // Generate event names by category
    const eventNames = {
      'Wedding': ['Summer Wedding', 'Beach Wedding', 'Garden Wedding', 'Winter Wonderland Wedding'],
      'Corporate': ['Annual Meeting', 'Product Launch', 'Team Building', 'Executive Retreat'],
      'Birthday': ['Sweet 16', '30th Celebration', '50th Anniversary', 'Kids Birthday'],
      'Conference': ['Tech Summit', 'Medical Conference', 'Education Symposium', 'Industry Meetup']
    };
    
    // Generate 20 events across different categories
    for (let i = 0; i < 20; i++) {
      const id = this.nextId++;
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      const eventNameList = eventNames[category.name as keyof typeof eventNames];
      const eventName = eventNameList[i % eventNameList.length];
      
      // Generate a date between now and 3 months in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90));
      
      // For some past events
      if (i < 5) {
        futureDate.setDate(futureDate.getDate() - Math.floor(Math.random() * 30) - 60);
      }
      
      // Make time more realistic
      const hours = parseInt(category.default_start_time.split(':')[0]);
      const minutes = parseInt(category.default_start_time.split(':')[1]);
      futureDate.setHours(hours, minutes, 0, 0);
      
      // Generate some mock bookings
      const bookings = [];
      const numBookings = Math.floor(Math.random() * 5);
      for (let j = 0; j < numBookings; j++) {
        bookings.push({
          id: `booking-${id}-${j}`,
          event_id: id.toString(),
          customer_id: `customer-${Math.floor(Math.random() * 10) + 1}`,
          attendees: Math.floor(Math.random() * 5) + 1,
          notes: j % 2 === 0 ? 'Special request for seating' : '',
          created_at: new Date().toISOString()
        });
      }
      
      this.events.push({
        id: id.toString(),
        name: `${eventName} ${id}`,
        category_id: category.id,
        capacity: Math.floor(Math.random() * 50) + category.default_capacity,
        start_time: futureDate.toISOString(),
        notes: i % 3 === 0 ? 'VIP event' : i % 3 === 1 ? 'Requires special setup' : '',
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        category: category,
        bookings: bookings
      });
    }
  }
  
  getAllEvents(): EventWithRelations[] {
    return [...this.events].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }
  
  getEventById(id: string): EventWithRelations | null {
    return this.events.find(event => event.id === id) || null;
  }
  
  getUpcomingEvents(): EventWithRelations[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.events
      .filter(event => new Date(event.start_time) >= today)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }
  
  getEventsByCategory(categoryId: string): EventWithRelations[] {
    return this.events
      .filter(event => event.category_id === categoryId)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }
  
  createEvent(eventData: Omit<Event, 'id' | 'created_at'>): EventWithRelations {
    const newEvent: EventWithRelations = {
      ...eventData,
      id: this.nextId.toString(),
      created_at: new Date().toISOString(),
      category: { 
        id: eventData.category_id,
        name: `Category ${eventData.category_id}`,
        default_capacity: 0,
        default_start_time: '',
        notes: '',
        created_at: new Date().toISOString()
      },
      bookings: []
    };
    
    this.nextId++;
    this.events.push(newEvent);
    return newEvent;
  }
  
  updateEvent(id: string, eventData: Partial<Omit<Event, 'id' | 'created_at'>>): EventWithRelations {
    const index = this.events.findIndex(event => event.id === id);
    
    if (index === -1) {
      throw new Error(`Event with id ${id} not found`);
    }
    
    const updatedEvent = {
      ...this.events[index],
      ...eventData
    };
    
    // If category_id changed, update the category relation
    if (eventData.category_id && eventData.category_id !== this.events[index].category_id) {
      updatedEvent.category = {
        id: eventData.category_id,
        name: `Category ${eventData.category_id}`,
        default_capacity: 0,
        default_start_time: '',
        notes: '',
        created_at: new Date().toISOString()
      };
    }
    
    this.events[index] = updatedEvent;
    return updatedEvent;
  }
  
  deleteEvent(id: string): void {
    const index = this.events.findIndex(event => event.id === id);
    
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
}

// Create a single instance of the mock data handler
const mockEventData = new MockEventData();

export const eventService = {
  getAllEvents: async () => {
    if (isMockMode) {
      console.info('Using mock event data instead of Supabase');
      return mockEventData.getAllEvents();
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          category:event_categories(*),
          bookings:bookings(*)
        `)
        .order('start_time', { ascending: true });
      
      if (error) {
        console.error('Error fetching events from Supabase:', error);
        console.info('Falling back to mock event data');
        return mockEventData.getAllEvents();
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching events from Supabase:', err);
      console.info('Falling back to mock event data');
      return mockEventData.getAllEvents();
    }
  },

  getEventById: async (id: string) => {
    if (isMockMode) {
      console.info(`Using mock data to get event with id ${id}`);
      return mockEventData.getEventById(id);
    }
    
    try {
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
        console.error(`Error fetching event with id ${id} from Supabase:`, error);
        console.info('Falling back to mock event data');
        return mockEventData.getEventById(id);
      }
      
      return data;
    } catch (err) {
      console.error(`Exception fetching event with id ${id} from Supabase:`, err);
      console.info('Falling back to mock event data');
      return mockEventData.getEventById(id);
    }
  },

  getUpcomingEvents: async () => {
    if (isMockMode) {
      console.info('Using mock data for upcoming events');
      return mockEventData.getUpcomingEvents();
    }
    
    try {
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
        console.error('Error fetching upcoming events from Supabase:', error);
        console.info('Falling back to mock event data');
        return mockEventData.getUpcomingEvents();
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching upcoming events from Supabase:', err);
      console.info('Falling back to mock event data');
      return mockEventData.getUpcomingEvents();
    }
  },

  getEventsByCategory: async (categoryId: string) => {
    if (isMockMode) {
      console.info(`Using mock data for events in category ${categoryId}`);
      return mockEventData.getEventsByCategory(categoryId);
    }
    
    try {
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
        console.error(`Error fetching events for category ${categoryId} from Supabase:`, error);
        console.info('Falling back to mock event data');
        return mockEventData.getEventsByCategory(categoryId);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Exception fetching events for category ${categoryId} from Supabase:`, err);
      console.info('Falling back to mock event data');
      return mockEventData.getEventsByCategory(categoryId);
    }
  },

  createEvent: async (eventData: any) => {
    if (isMockMode) {
      console.info('Using mock data to create event');
      return mockEventData.createEvent(eventData);
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select();
      
      if (error) {
        console.error('Error creating event in Supabase:', error);
        console.info('Falling back to mock event data');
        return mockEventData.createEvent(eventData);
      }
      
      return data?.[0];
    } catch (err) {
      console.error('Exception creating event in Supabase:', err);
      console.info('Falling back to mock event data');
      return mockEventData.createEvent(eventData);
    }
  },

  updateEvent: async (id: string, eventData: any) => {
    if (isMockMode) {
      console.info(`Using mock data to update event with id ${id}`);
      return mockEventData.updateEvent(id, eventData);
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`Error updating event with id ${id} in Supabase:`, error);
        console.info('Falling back to mock event data');
        return mockEventData.updateEvent(id, eventData);
      }
      
      return data?.[0];
    } catch (err) {
      console.error(`Exception updating event with id ${id} in Supabase:`, err);
      console.info('Falling back to mock event data');
      return mockEventData.updateEvent(id, eventData);
    }
  },

  deleteEvent: async (id: string) => {
    if (isMockMode) {
      console.info(`Using mock data to delete event with id ${id}`);
      mockEventData.deleteEvent(id);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting event with id ${id} from Supabase:`, error);
        console.info('Falling back to mock event data');
        mockEventData.deleteEvent(id);
      }
    } catch (err) {
      console.error(`Exception deleting event with id ${id} from Supabase:`, err);
      console.info('Falling back to mock event data');
      mockEventData.deleteEvent(id);
    }
  }
}; 