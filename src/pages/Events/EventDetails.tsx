import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Event, Booking } from '../../types/database.types';
import { eventService } from '../../services/eventService';
import { supabase } from '../../services/supabase';
import { formatDateTime } from '../../utils/formatUtils';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Load event details
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
        
        // Load event's bookings
        const { data, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            customer:customers(*)
          `)
          .eq('event_id', id)
          .order('created_at', { ascending: false });
        
        if (bookingsError) throw bookingsError;
        
        setBookings(data || []);
        setError(null);
      } catch (err) {
        console.error('Error loading event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadEventDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !event) return;
    
    if (window.confirm(`Are you sure you want to delete the event "${event.name}"?`)) {
      try {
        setLoading(true);
        await eventService.deleteEvent(id);
        navigate('/events');
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event. Please try again.');
        setLoading(false);
      }
    }
  };

  // Add a function to calculate total attendees
  const calculateTotalAttendees = (): number => {
    return bookings.reduce((total, booking) => total + booking.attendees, 0);
  };
  
  // Add a function to get capacity status styling
  const getCapacityStatusStyle = (): React.CSSProperties => {
    if (!event) return {};
    
    const totalAttendees = calculateTotalAttendees();
    const percentFull = (totalAttendees / event.capacity) * 100;
    
    if (percentFull >= 90) {
      return { color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' };
    } else if (percentFull >= 70) {
      return { color: '#92400E', backgroundColor: '#FEF3C7', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' };
    } else {
      return { color: '#166534', backgroundColor: '#DCFCE7', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' };
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/events')}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Event not found.</p>
        <button 
          onClick={() => navigate('/events')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <div className="space-x-2">
          <Link
            to={`/events/${id}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{event.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Category</p>
            <p className="font-medium">{event.category?.name || 'Unknown'}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Date & Time</p>
            <p className="font-medium">{formatDateTime(event.start_time)}</p>
          </div>
          
          <div>
            <p className="text-gray-600">Capacity</p>
            <p className="font-medium">
              <span style={getCapacityStatusStyle()}>
                {calculateTotalAttendees()} / {event.capacity} 
                <span className="ml-2 text-sm">
                  ({event.capacity - calculateTotalAttendees()} available)
                </span>
              </span>
            </p>
          </div>
          
          {event.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-600">Notes</p>
              <p className="font-medium whitespace-pre-line">{event.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bookings</h2>
          <Link
            to={`/bookings/new?eventId=${id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Booking
          </Link>
        </div>
        
        {bookings.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center">
            <p className="text-gray-600">No bookings found for this event.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {booking.customer ? (
                          <Link to={`/customers/${booking.customer.id}`} className="hover:text-indigo-600">
                            {booking.customer.first_name} {booking.customer.last_name}
                          </Link>
                        ) : (
                          'Unknown Customer'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {booking.customer?.mobile_number || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-500 truncate max-w-xs">
                        {booking.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails; 