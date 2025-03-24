import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import { Booking } from '../../types/database.types';
import { bookingService } from '../../services/bookingService';

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
        
        if (id) {
          // Get real data from Supabase
          const bookingData = await bookingService.getBookingById(id);
          setBooking(bookingData);
        }
      } catch (err) {
        console.error('Error loading booking:', err);
        setError('Failed to load booking. Please try again later.');
      } finally {
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