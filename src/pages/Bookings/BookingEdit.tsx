import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import { Booking } from '../../types/database.types';

const BookingEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        
        // Create mock data for development
        setTimeout(() => {
          if (id) {
            const mockBooking: Booking = {
              id: id,
              customer_id: String(Math.floor(Math.random() * 10) + 1),
              event_id: String(Math.floor(Math.random() * 8) + 1),
              attendees: Math.floor(Math.random() * 5) + 1,
              notes: Math.random() > 0.5 ? `Notes for booking ${id}` : '',
              created_at: new Date().toISOString(),
              customer: {
                id: String(Math.floor(Math.random() * 10) + 1),
                first_name: `First${id}`,
                last_name: `Last${id}`,
                mobile_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                created_at: new Date().toISOString()
              },
              event: {
                id: String(Math.floor(Math.random() * 8) + 1),
                name: `Event ${id}`,
                category_id: String(Math.floor(Math.random() * 5) + 1),
                capacity: 50 + (parseInt(id) * 10),
                start_time: new Date(Date.now() + (parseInt(id) * 86400000)).toISOString(),
                created_at: new Date().toISOString(),
                remaining_capacity: 30 + Math.floor(Math.random() * 10),
                event_category: {
                  id: String(Math.floor(Math.random() * 5) + 1),
                  name: `Category ${Math.floor(Math.random() * 5) + 1}`,
                  default_capacity: 100,
                  default_start_time: '09:00',
                  created_at: new Date().toISOString()
                }
              }
            };
            
            setBooking(mockBooking);
            setLoading(false);
          }
        }, 500);
      } catch (err) {
        console.error('Error loading booking:', err);
        setError('Failed to load booking details. Please try again later.');
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  // Define styles
  const containerStyle: React.CSSProperties = {
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '1rem'
  };
  
  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2rem',
    color: '#4F46E5'
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: '4px',
    borderLeftColor: '#EF4444',
    color: '#B91C1C',
    padding: '1rem',
    marginBottom: '1rem'
  };

  if (loading) {
    return <div style={containerStyle}><div style={loadingStyle}>Loading booking details...</div></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/bookings')}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6B7280';
            }}
          >
            Go Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>Booking not found</p>
          <button 
            onClick={() => navigate('/bookings')}
            style={{
              backgroundColor: '#6B7280',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              marginTop: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6B7280';
            }}
          >
            Go Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return <BookingForm initialData={booking} isEdit={true} />;
};

export default BookingEdit; 