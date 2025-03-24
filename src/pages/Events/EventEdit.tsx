import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventForm from './EventForm';
import { Event } from '../../types/database.types';
import { eventService } from '../../services/eventService';

const EventEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        
        if (id) {
          // Get real data from Supabase
          const eventData = await eventService.getEventById(id);
          setEvent(eventData);
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Failed to load event. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading event...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: '#EF4444', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '2rem', color: '#EF4444', textAlign: 'center' }}>
        Event not found.
      </div>
    );
  }

  return (
    <div>
      <EventForm initialData={event} isEdit={true} />
    </div>
  );
};

export default EventEdit; 