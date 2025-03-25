import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Booking, Customer, Event } from '../../types/database.types';
import { bookingService } from '../../services/bookingService';
import { customerService } from '../../services/customerService';
import { eventService } from '../../services/eventService';
import { formatDateTime } from '../../utils/formatUtils';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (formData.event_id) {
      loadEventDetails(formData.event_id);
    }
  }, [formData.event_id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load customers and events in parallel using real data from services
      const [customersData, eventsData] = await Promise.all([
        customerService.getAllCustomers(),
        eventService.getAllEvents()
      ]);
      
      setCustomers(customersData);
      setEvents(eventsData);
      
      // If editing, load event details
      if (formData.event_id) {
        loadEventDetails(formData.event_id);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading form data:', err);
      setError('Failed to load necessary data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetails = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
      } else {
        const eventData = await eventService.getEventById(eventId);
        setSelectedEvent(eventData);
      }
    } catch (err) {
      console.error('Error loading event details:', err);
      setError('Failed to load event details. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'event_id' && value) {
      loadEventDetails(value);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.customer_id) {
      setError('Please select a customer');
      return false;
    }
    
    if (!formData.event_id) {
      setError('Please select an event');
      return false;
    }
    
    const attendees = parseInt(formData.attendees);
    if (isNaN(attendees) || attendees < 0) {
      setError('Number of attendees must be zero or a positive number');
      return false;
    }
    
    // Check if exceeding remaining capacity (only for new bookings or increased attendees)
    if (selectedEvent && selectedEvent.remaining_capacity !== undefined) {
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
      customer_id: formData.customer_id,
      event_id: formData.event_id,
      attendees: parseInt(formData.attendees),
      notes: formData.notes
    };
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEdit && id) {
        // Update existing booking
        await bookingService.updateBooking(id, bookingData);
        navigate(`/bookings/${id}`);
      } else {
        // Create new booking
        const newBooking = await bookingService.createBooking(bookingData);
        navigate('/bookings');
      }
    } catch (err) {
      console.error('Error saving booking:', err);
      setError('Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
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
    ...inputStyle,
    backgroundColor: 'white'
  };
  
  const eventDetailsStyle: React.CSSProperties = {
    backgroundColor: '#F3F4F6',
    borderRadius: '0.375rem',
    padding: '1rem',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  };
  
  const eventDetailItemStyle: React.CSSProperties = {
    marginBottom: '0.5rem' 
  };
  
  const capacityAvailableStyle: React.CSSProperties = {
    color: '#047857',
    fontWeight: 'bold'
  };
  
  const capacityLimitedStyle: React.CSSProperties = {
    color: '#D97706',
    fontWeight: 'bold'
  };
  
  const capacityFullStyle: React.CSSProperties = {
    color: '#DC2626',
    fontWeight: 'bold'
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const helperTextStyle: React.CSSProperties = {
    color: '#6B7280',
    fontSize: '0.75rem',
    fontStyle: 'italic'
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
  
  const getCapacityStyle = () => {
    if (!selectedEvent || selectedEvent.remaining_capacity === undefined) {
      return {};
    }
    
    const remainingPercentage = (selectedEvent.remaining_capacity / selectedEvent.capacity) * 100;
    
    if (remainingPercentage <= 10) {
      return capacityFullStyle;
    } else if (remainingPercentage <= 30) {
      return capacityLimitedStyle;
    } else {
      return capacityAvailableStyle;
    }
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
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name}
              </option>
            ))}
          </select>
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
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} - {formatDateTime(event.start_time)}
              </option>
            ))}
          </select>
          
          {selectedEvent && (
            <div style={eventDetailsStyle}>
              <div style={eventDetailItemStyle}>
                <strong>Date & Time:</strong> {formatDateTime(selectedEvent.start_time)}
              </div>
              <div style={eventDetailItemStyle}>
                <strong>Category:</strong> {selectedEvent.category?.name || 'Unknown'}
              </div>
              {selectedEvent.remaining_capacity !== undefined && (
                <div style={{ ...eventDetailItemStyle, ...getCapacityStyle() }}>
                  <strong>Available:</strong> {selectedEvent.remaining_capacity} of {selectedEvent.capacity} spots
                </div>
              )}
              {selectedEvent.notes && (
                <div style={eventDetailItemStyle}>
                  <strong>Notes:</strong> {selectedEvent.notes}
                </div>
              )}
            </div>
          )}
        </div>
        
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
            min="0"
            placeholder="Number of Attendees"
            value={formData.attendees}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <p style={helperTextStyle}>Enter 0 for reminder-only bookings</p>
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