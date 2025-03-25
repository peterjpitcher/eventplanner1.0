import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Booking } from '../../types/database.types';
import { bookingService } from '../../services/bookingService';
import { formatDateTime } from '../../utils/formatUtils';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await bookingService.getBookingById(id);
        setBooking(data);
        setError(null);
      } catch (err) {
        console.error('Error loading booking details:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadBooking();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !booking) return;
    
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setLoading(true);
        await bookingService.deleteBooking(id);
        navigate('/bookings');
      } catch (err) {
        console.error('Error deleting booking:', err);
        setError('Failed to delete booking. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading booking details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/bookings')}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Booking not found.</p>
        <button 
          onClick={() => navigate('/bookings')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <div className="space-x-2">
          <Link
            to={`/bookings/${id}/edit`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel Booking
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Event</p>
            <p className="font-medium">
              {booking.event ? (
                <Link to={`/events/${booking.event.id}`} className="text-indigo-600 hover:text-indigo-800">
                  {booking.event.name}
                </Link>
              ) : (
                'Unknown Event'
              )}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">Date & Time</p>
            <p className="font-medium">
              {booking.event ? formatDateTime(booking.event.start_time) : 'Unknown'}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">Customer</p>
            <p className="font-medium">
              {booking.customer ? (
                <Link to={`/customers/${booking.customer.id}`} className="text-indigo-600 hover:text-indigo-800">
                  {booking.customer.first_name} {booking.customer.last_name}
                </Link>
              ) : (
                'Unknown Customer'
              )}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">Mobile Number</p>
            <p className="font-medium">
              {booking.customer ? booking.customer.mobile_number : 'Unknown'}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-gray-600">Created</p>
            <p className="font-medium">
              {formatDateTime(booking.created_at)}
            </p>
          </div>
          
          {booking.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-600">Notes</p>
              <p className="font-medium whitespace-pre-line">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Link
          to="/bookings"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Bookings
        </Link>
        
        {booking.event && (
          <Link
            to={`/events/${booking.event.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            View Event
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookingDetails; 