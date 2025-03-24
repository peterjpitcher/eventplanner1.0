export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  notes?: string;
  created_at: string;
}

export interface EventCategory {
  id: string;
  name: string;
  default_capacity: number;
  default_start_time: string;
  notes?: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  category_id: string;
  capacity: number;
  start_time: string;
  notes?: string;
  created_at: string;
  category?: EventCategory;
  event_category?: EventCategory;
  remaining_capacity?: number;
}

// Event type with full relation data expanded
export interface EventWithRelations extends Event {
  category: EventCategory;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  customer_id: string;
  event_id: string;
  attendees: number;
  notes?: string;
  created_at: string;
  customer?: Customer;
  event?: Event;
} 