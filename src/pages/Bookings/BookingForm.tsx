import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Booking, Customer, Event } from '../../types/database.types';
import { bookingService } from '../../services/bookingService';
import { customerService } from '../../services/customerService';
import { eventService } from '../../services/eventService';

type BookingFormProps = {
  initialData?: Partial<Booking>;
  isEdit?: boolean;
};

const BookingForm: React.FC<BookingFormProps> = ({ initialData = {}, isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preselectedEventId = searchParams.get('eventId');
  const preselectedCustomerId = searchParams.get('customerId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    event_id: initialData.event_id || preselectedEventId || '',
    customer_id: initialData.customer_id || preselectedCustomerId || '',
    attendees: initialData.attendees?.toString() || '1',
    notes: initialData.notes || '',
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load events
        const eventsData = await eventService.getUpcomingEvents();
        setEvents(eventsData);
        
        // Load customers
        const customersData = await customerService.getAllCustomers();
        setCustomers(customersData);
        
        // If we have a preselected event or event from initial data, load its details
        const eventToLoad = initialData.event_id || preselectedEventId;
        if (eventToLoad) {
          loadEventDetails(eventToLoad);
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load form data. Please try again later.');
      }
    };
    
    loadData();
  }, [initialData.event_id, preselectedEventId]);

  const loadEventDetails = async (eventId: string) => {
    try {
      // Get the event details
      const eventData = await eventService.getEventById(eventId);
      setSelectedEvent(eventData);
      
      // Get the current booking count for capacity check
      const bookings = await bookingService.getBookingsByEvent(eventId);
      setBookingCount(bookings.length);
    } catch (err) {
      console.error('Error loading event details:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If event is changed, load its details
    if (name === 'event_id' && value) {
      loadEventDetails(value);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.event_id) {
      setError('Event is required');
      return false;
    }
    
    if (!formData.customer_id) {
      setError('Customer is required');
      return false;
    }
    
    const attendees = parseInt(formData.attendees);
    if (isNaN(attendees) || attendees <= 0) {
      setError('Number of attendees must be a positive number');
      return false;
    }
    
    // Check if exceeding remaining capacity (only for new bookings or increased attendees)
    if (selectedEvent) {
      const originalAttendees = initialData?.attendees || 0;
      const additionalAttendees = attendees - (isEdit ? originalAttendees : 0);
      
      if (additionalAttendees > 0 && 
          selectedEvent.remaining_capacity !== undefined && 
          additionalAttendees > selectedEvent.remaining_capacity) {
        setError(`Cannot book ${attendees} attendees. Only ${selectedEvent.remaining_capacity} spots available.`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const bookingData = {
      ...formData,
      attendees: parseInt(formData.attendees),
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // For development, mock the API calls
      setTimeout(() => {
        if (isEdit && id) {
          // Mock update
          console.log('Booking updated:', { id, ...bookingData });
          navigate(`/bookings/${id}`);
        } else {
          // Mock create
          const newId = Math.floor(Math.random() * 1000).toString();
          console.log('Booking created:', { id: newId, ...bookingData });
          navigate(`/bookings/${newId}`);
        }
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error saving booking:', err);
      setError('Failed to save booking. Please try again.');
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Define styles
  const containerStyle: React.CSSProperties = {
    maxWidth: '42rem',
    margin: '0 auto'
  };
  
  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#111827'
  };
  
  const errorContainerStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: '4px',
    borderLeftColor: '#EF4444',
    color: '#B91C1C',
    padding: '1rem',
    marginBottom: '1rem'
  };
  
  const formStyle: React.CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.375rem',
    padding: '2rem',
    marginBottom: '1rem'
  };
  
  const formGroupStyle: React.CSSProperties = {
    marginBottom: '1rem'
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };
  
  const inputStyle: React.CSSProperties = {
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    appearance: 'none',
    borderWidth: '1px',
    borderRadius: '0.25rem',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#1F2937'
  };
  
  const selectStyle: React.CSSProperties = {
    ...inputStyle
  };
  
  const infoContainerStyle: React.CSSProperties = {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: '4px',
    borderLeftColor: '#3B82F6',
    padding: '1rem',
    marginBottom: '1rem'
  };
  
  const warningTextStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    marginTop: '0.25rem'
  };
  
  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '1.5rem'
  };
  
  const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: '#6B7280',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer'
  };
  
  const submitButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer'
  };
  
  const disabledButtonStyle: React.CSSProperties = {
    opacity: 0.7,
    cursor: 'not-allowed'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        {isEdit ? 'Edit Booking' : 'Add New Booking'}
      </h1>
      
      {error && (
        <div style={errorContainerStyle} role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="customer_id"
          >
            Customer *
          </label>
          <select
            style={selectStyle}
            id="customer_id"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name} ({customer.mobile_number})
              </option>
            ))}
          </select>
          {customers.length === 0 && (
            <p style={warningTextStyle}>
              No customers available. Please add a customer first.
            </p>
          )}
        </div>
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="event_id"
          >
            Event *
          </label>
          <select
            style={selectStyle}
            id="event_id"
            name="event_id"
            value={formData.event_id}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - {formatDateTime(event.start_time)}
              </option>
            ))}
          </select>
          {events.length === 0 && (
            <p style={warningTextStyle}>
              No events available. Please create an event first.
            </p>
          )}
          
          {selectedEvent && bookingCount !== null && (
            <p style={infoContainerStyle}>
              <strong>Capacity:</strong> {bookingCount} / {selectedEvent.capacity} 
              ({selectedEvent.capacity - bookingCount} spots available)
            </p>
          )}
        </div>
        
        {selectedEvent && (
          <div style={infoContainerStyle}>
            <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
              Event Details:
            </p>
            <p>
              <strong>Event:</strong> {selectedEvent.name}
            </p>
            <p>
              <strong>Category:</strong> {selectedEvent.event_category?.name || 'Uncategorized'}
            </p>
            <p>
              <strong>Date & Time:</strong> {formatDateTime(selectedEvent.start_time)}
            </p>
            <p>
              <strong>Available Spots:</strong> {selectedEvent.remaining_capacity || 0} (of {selectedEvent.capacity})
            </p>
          </div>
        )}
        
        <div style={formGroupStyle}>
          <label 
            style={labelStyle} 
            htmlFor="attendees"
          >
            Number of Attendees *
          </label>
          <input
            style={inputStyle}
            id="attendees"
            name="attendees"
            type="number"
            min="1"
            placeholder="Number of Attendees"
            value={formData.attendees}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div style={{...formGroupStyle, marginBottom: '1.5rem'}}>
          <label 
            style={labelStyle} 
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            style={inputStyle}
            id="notes"
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            rows={4}
          />
        </div>
        
        <div style={buttonContainerStyle}>
          <button
            style={{
              ...cancelButtonStyle,
              ...(loading ? disabledButtonStyle : {})
            }}
            type="button"
            onClick={() => navigate('/bookings')}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4B5563';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#6B7280';
              }
            }}
          >
            Cancel
          </button>
          <button
            style={{
              ...submitButtonStyle,
              ...(loading ? disabledButtonStyle : {})
            }}
            type="submit"
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4338CA';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4F46E5';
              }
            }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Booking' : 'Add Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 