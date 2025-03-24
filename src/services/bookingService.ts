import { supabase } from './supabase';
import { Booking } from '../types/database.types';
import { smsService } from './smsService';
import { customerService } from './customerService';
import { eventService } from './eventService';

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        event:events(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
    
    return data || [];
  },

  getBookingById: async (id: string): Promise<Booking> => {
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
      console.error(`Error fetching booking with id ${id}:`, error);
      throw error;
    }
    
    return data;
  },

  getBookingsByEvent: async (eventId: string): Promise<Booking[]> => {
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
      console.error(`Error fetching bookings for event ${eventId}:`, error);
      throw error;
    }
    
    return data || [];
  },

  getBookingsByCustomer: async (customerId: string): Promise<Booking[]> => {
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
      console.error(`Error fetching bookings for customer ${customerId}:`, error);
      throw error;
    }
    
    return data || [];
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    // First check if the event has capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('capacity, name, start_time')
      .eq('id', bookingData.event_id)
      .single();
    
    if (eventError) {
      console.error(`Error fetching event ${bookingData.event_id}:`, eventError);
      throw eventError;
    }
    
    // Count existing bookings for this event
    const { count, error: countError } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('event_id', bookingData.event_id);
    
    if (countError) {
      console.error(`Error counting bookings for event ${bookingData.event_id}:`, countError);
      throw countError;
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
      console.error('Error creating booking:', error);
      throw error;
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
  },

  updateBooking: async (id: string, bookingData: Partial<Booking>): Promise<void> => {
    const { error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating booking with id ${id}:`, error);
      throw error;
    }
  },

  deleteBooking: async (id: string): Promise<void> => {
    // Get booking details before deletion for SMS notification
    const booking = await bookingService.getBookingById(id);
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting booking with id ${id}:`, error);
      throw error;
    }
    
    // Send cancellation SMS if we have customer and event data
    if (booking.customer && booking.event) {
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
  },
  
  sendEventReminders: async (eventId: string): Promise<{ success: number; failed: number }> => {
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
      console.error('Error sending event reminders:', error);
      throw error;
    }
  }
}; 