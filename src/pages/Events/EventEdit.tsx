import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from './EventForm';
import { Event } from '../../types/database.types';

const EventEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        
        // Create mock data for development
        setTimeout(() => {
          if (id) {
            const mockEvent: Event = {
              id: id,
              name: `Event ${id}`,
              category_id: String(Math.floor(Math.random() * 5) + 1),
              capacity: 50 + (parseInt(id) * 10),
              start_time: new Date(Date.now() + (parseInt(id) * 86400000)).toISOString(),
              notes: `Notes for event ${id}`,
              created_at: new Date().toISOString(),
              event_category: {
                id: String(Math.floor(Math.random() * 5) + 1),
                name: `Category ${Math.floor(Math.random() * 5) + 1}`,
                default_capacity: 100,
                default_start_time: '09:00',
                created_at: new Date().toISOString()
              }
            };
            
            setEvent(mockEvent);
            setLoading(false);
          }
        }, 500);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    loadEvent();
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
    return <div style={containerStyle}><div style={loadingStyle}>Loading event details...</div></div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/events')}
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
            Go Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle} role="alert">
          <p>Event not found</p>
          <button 
            onClick={() => navigate('/events')}
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
            Go Back to Events
          </button>
        </div>
      </div>
    );
  }

  return <EventForm initialData={event} isEdit={true} />;
};

export default EventEdit; 