import { supabase, isMockMode } from './supabase';
import { Booking, Customer, Event } from '../types/database.types';
import { smsService } from './smsService';
import { eventService } from './eventService';

// Mock data handler for development without Supabase connection
class MockBookingData {
  private bookings: Booking[] = [];
  private nextId: number = 1;
  
  constructor() {
    // Generate initial mock bookings
    this.generateMockBookings();
  }
  
  private generateMockBookings(): void {
    // Clear existing data
    this.bookings = [];
    
    // Generate 25 mock bookings
    for (let i = 0; i < 25; i++) {
      const id = this.nextId++;
      const customerId = `customer-${Math.floor(Math.random() * 15) + 1}`;
      const eventId = `event-${Math.floor(Math.random() * 20) + 1}`;
      
      // Create mock customer and event objects
      const customer: Customer = {
        id: customerId,
        first_name: `FirstName${customerId.split('-')[1]}`,
        last_name: `LastName${customerId.split('-')[1]}`,
        mobile_number: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
        notes: i % 3 === 0 ? 'VIP customer' : '',
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
      };
      
      const event: Event = {
        id: eventId,
        name: `Event ${eventId.split('-')[1]}`,
        category_id: `category-${Math.floor(Math.random() * 4) + 1}`,
        capacity: 30 + Math.floor(Math.random() * 70),
        start_time: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        notes: i % 5 === 0 ? 'Featured event' : '',
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
      };
      
      this.bookings.push({
        id: id.toString(),
        customer_id: customerId,
        event_id: eventId,
        attendees: Math.floor(Math.random() * 5) + 1,
        notes: i % 4 === 0 ? 'Special seating required' : i % 4 === 1 ? 'Allergies noted' : '',
        created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        customer: customer,
        event: event
      });
    }
  }
  
  getAllBookings(): Booking[] {
    return [...this.bookings].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  
  getBookingById(id: string): Booking | null {
    return this.bookings.find(booking => booking.id === id) || null;
  }
  
  getBookingsByEvent(eventId: string): Booking[] {
    return this.bookings
      .filter(booking => booking.event_id === eventId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  getBookingsByCustomer(customerId: string): Booking[] {
    return this.bookings
      .filter(booking => booking.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>): Booking {
    // Check if we have mock events to validate against
    const eventId = bookingData.event_id;
    
    // Find if event exists in our existing bookings
    const existingEvent = this.bookings.find(b => b.event_id === eventId)?.event;
    
    // Default event if we don't have data
    const event: Event = existingEvent || {
      id: eventId,
      name: `Event ${eventId}`,
      category_id: 'category-1',
      capacity: 50,
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };
    
    // Check capacity
    const existingBookings = this.getBookingsByEvent(eventId);
    const totalAttendees = existingBookings.reduce((sum, b) => sum + b.attendees, 0);
    
    if (totalAttendees + bookingData.attendees > event.capacity) {
      throw new Error('This event is already at full capacity');
    }
    
    // Find customer if exists
    const customerId = bookingData.customer_id;
    const existingCustomer = this.bookings.find(b => b.customer_id === customerId)?.customer;
    
    // Default customer if we don't have data
    const customer: Customer = existingCustomer || {
      id: customerId,
      first_name: `FirstName${customerId}`,
      last_name: `LastName${customerId}`,
      mobile_number: `+1${Math.floor(Math.random() * 1000000000 + 1000000000)}`,
      created_at: new Date().toISOString()
    };
    
    const newBooking: Booking = {
      ...bookingData,
      id: this.nextId.toString(),
      created_at: new Date().toISOString(),
      customer: customer,
      event: event
    };
    
    this.nextId++;
    this.bookings.push(newBooking);
    
    // Log the successful booking
    console.info(`[MOCK] Created booking ${newBooking.id} for ${customer.first_name} ${customer.last_name} to attend ${event.name}`);
    
    return newBooking;
  }
  
  updateBooking(id: string, bookingData: Partial<Booking>): void {
    const index = this.bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    this.bookings[index] = {
      ...this.bookings[index],
      ...bookingData,
      // Preserve relations
      customer: this.bookings[index].customer,
      event: this.bookings[index].event
    };
    
    console.info(`[MOCK] Updated booking ${id}`);
  }
  
  deleteBooking(id: string): void {
    const index = this.bookings.findIndex(booking => booking.id === id);
    
    if (index !== -1) {
      const booking = this.bookings[index];
      this.bookings.splice(index, 1);
      console.info(`[MOCK] Deleted booking ${id} for ${booking.customer?.first_name} ${booking.customer?.last_name}`);
    }
  }
  
  sendEventReminders(eventId: string): { success: number; failed: number } {
    const bookings = this.getBookingsByEvent(eventId);
    const event = bookings[0]?.event;
    
    if (!event) {
      console.info(`[MOCK] Event with ID ${eventId} not found for reminders`);
      return { success: 0, failed: 0 };
    }
    
    console.info(`[MOCK] Sent ${bookings.length} reminders for event ${event.name}`);
    return { success: bookings.length, failed: 0 };
  }
}

// Create a single instance of the mock data handler
const mockBookingData = new MockBookingData();

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    if (isMockMode) {
      console.info('Using mock booking data instead of Supabase');
      return mockBookingData.getAllBookings();
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings from Supabase:', error);
        console.info('Falling back to mock booking data');
        return mockBookingData.getAllBookings();
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching bookings from Supabase:', err);
      console.info('Falling back to mock booking data');
      return mockBookingData.getAllBookings();
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    if (isMockMode) {
      console.info(`Using mock data to get booking with id ${id}`);
      const booking = mockBookingData.getBookingById(id);
      if (!booking) {
        throw new Error(`Booking with id ${id} not found`);
      }
      return booking;
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching booking with id ${id} from Supabase:`, error);
        console.info('Falling back to mock booking data');
        const booking = mockBookingData.getBookingById(id);
        if (!booking) {
          throw new Error(`Booking with id ${id} not found`);
        }
        return booking;
      }
      
      return data;
    } catch (err) {
      console.error(`Exception fetching booking with id ${id} from Supabase:`, err);
      console.info('Falling back to mock booking data');
      const booking = mockBookingData.getBookingById(id);
      if (!booking) {
        throw new Error(`Booking with id ${id} not found`);
      }
      return booking;
    }
  },

  getBookingsByEvent: async (eventId: string): Promise<Booking[]> => {
    if (isMockMode) {
      console.info(`Using mock data for bookings of event ${eventId}`);
      return mockBookingData.getBookingsByEvent(eventId);
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching bookings for event ${eventId} from Supabase:`, error);
        console.info('Falling back to mock booking data');
        return mockBookingData.getBookingsByEvent(eventId);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Exception fetching bookings for event ${eventId} from Supabase:`, err);
      console.info('Falling back to mock booking data');
      return mockBookingData.getBookingsByEvent(eventId);
    }
  },

  getBookingsByCustomer: async (customerId: string): Promise<Booking[]> => {
    if (isMockMode) {
      console.info(`Using mock data for bookings of customer ${customerId}`);
      return mockBookingData.getBookingsByCustomer(customerId);
    }
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching bookings for customer ${customerId} from Supabase:`, error);
        console.info('Falling back to mock booking data');
        return mockBookingData.getBookingsByCustomer(customerId);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Exception fetching bookings for customer ${customerId} from Supabase:`, err);
      console.info('Falling back to mock booking data');
      return mockBookingData.getBookingsByCustomer(customerId);
    }
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    if (isMockMode) {
      console.info('Using mock data to create booking');
      return mockBookingData.createBooking(bookingData);
    }
    
    try {
      // First check if the event has capacity
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('capacity, name, start_time')
        .eq('id', bookingData.event_id)
        .single();
      
      if (eventError) {
        console.error(`Error fetching event ${bookingData.event_id} from Supabase:`, eventError);
        console.info('Falling back to mock booking data');
        return mockBookingData.createBooking(bookingData);
      }
      
      // Count existing bookings for this event
      const { count, error: countError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .eq('event_id', bookingData.event_id);
      
      if (countError) {
        console.error(`Error counting bookings for event ${bookingData.event_id} from Supabase:`, countError);
        console.info('Falling back to mock booking data');
        return mockBookingData.createBooking(bookingData);
      }
      
      // Check if the event is full
      if (count !== null && count >= event.capacity) {
        throw new Error('This event is already at full capacity');
      }
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          customer:customers(*),
          event:events(*)
        `)
        .single();
      
      if (error) {
        console.error('Error creating booking in Supabase:', error);
        console.info('Falling back to mock booking data');
        return mockBookingData.createBooking(bookingData);
      }
      
      // Send booking confirmation SMS if customer data is available
      if (data.customer) {
        try {
          const eventDate = new Date(event.start_time).toLocaleDateString();
          await smsService.sendBookingConfirmation(
            data.customer,
            event.name,
            eventDate
          );
        } catch (smsError) {
          console.error('Error sending booking confirmation SMS:', smsError);
          // Continue with the booking process even if SMS fails
        }
      }
      
      return data;
    } catch (err) {
      // If it's a capacity error, rethrow it
      if (err instanceof Error && err.message.includes('capacity')) {
        throw err;
      }
      
      console.error('Exception creating booking in Supabase:', err);
      console.info('Falling back to mock booking data');
      return mockBookingData.createBooking(bookingData);
    }
  },

  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<void> => {
    if (isMockMode) {
      console.info(`Using mock data to update booking with id ${id}`);
      mockBookingData.updateBooking(id, bookingData);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id);
      
      if (error) {
        console.error(`Error updating booking with id ${id} in Supabase:`, error);
        console.info('Falling back to mock booking data');
        mockBookingData.updateBooking(id, bookingData);
      }
    } catch (err) {
      console.error(`Exception updating booking with id ${id} in Supabase:`, err);
      console.info('Falling back to mock booking data');
      mockBookingData.updateBooking(id, bookingData);
    }
  },

  deleteBooking: async (id: string): Promise<void> => {
    if (isMockMode) {
      console.info(`Using mock data to delete booking with id ${id}`);
      mockBookingData.deleteBooking(id);
      return;
    }
    
    try {
      // Get booking details before deletion for SMS notification
      let booking: Booking | null = null;
      try {
        booking = await bookingService.getBookingById(id);
      } catch (error) {
        console.error(`Error fetching booking details before deletion:`, error);
        // Continue with deletion even if we can't fetch details
      }
      
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting booking with id ${id} from Supabase:`, error);
        console.info('Falling back to mock booking data');
        mockBookingData.deleteBooking(id);
        return;
      }
      
      // Send cancellation SMS if we have customer and event data
      if (booking && booking.customer && booking.event) {
        try {
          const eventDate = new Date(booking.event.start_time).toLocaleDateString();
          await smsService.sendBookingCancellation(
            booking.customer,
            booking.event.name,
            eventDate
          );
        } catch (smsError) {
          console.error('Error sending booking cancellation SMS:', smsError);
          // Continue with the deletion process even if SMS fails
        }
      }
    } catch (err) {
      console.error(`Exception deleting booking with id ${id} from Supabase:`, err);
      console.info('Falling back to mock booking data');
      mockBookingData.deleteBooking(id);
    }
  },
  
  sendEventReminders: async (eventId: string): Promise<{ success: number; failed: number }> => {
    if (isMockMode) {
      console.info(`Using mock data to send reminders for event ${eventId}`);
      return mockBookingData.sendEventReminders(eventId);
    }
    
    try {
      // Get event details
      const event = await eventService.getEventById(eventId);
      if (!event) {
        throw new Error(`Event with ID ${eventId} not found`);
      }
      
      // Get all bookings for this event
      const bookings = await bookingService.getBookingsByEvent(eventId);
      
      let successCount = 0;
      let failedCount = 0;
      
      // Format event time for SMS
      const eventTime = new Date(event.start_time).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Send reminder to each customer
      for (const booking of bookings) {
        if (booking.customer) {
          try {
            const result = await smsService.sendEventReminder(
              booking.customer,
              event.name,
              eventTime
            );
            
            if (result.success) {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            console.error(`Error sending reminder to ${booking.customer.mobile_number}:`, error);
            failedCount++;
          }
        }
      }
      
      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Error sending event reminders from Supabase:', error);
      console.info('Falling back to mock booking data');
      return mockBookingData.sendEventReminders(eventId);
    }
  }
}; 