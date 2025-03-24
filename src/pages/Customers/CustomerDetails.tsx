import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Customer, Booking } from '../../types/database.types';
import { customerService } from '../../services/customerService';
import { supabase } from '../../services/supabase';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Load customer details
        const customerData = await customerService.getCustomerById(id);
        setCustomer(customerData);
        
        // Load customer's bookings
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            event:events(*)
          `)
          .eq('customer_id', id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setBookings(data || []);
        setError(null);
      } catch (err) {
        console.error('Error loading customer details:', err);
        setError('Failed to load customer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomer();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !customer) return;
    
    if (window.confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}?`)) {
      try {
        setLoading(true);
        await customerService.deleteCustomer(id);
        navigate('/customers');
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError('Failed to delete customer. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading customer details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/customers')}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Customer not found.</p>
        <button 
          onClick={() => navigate('/customers')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div className="space-x-2">
          <Link
            to={`/customers/${id}/edit`}
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
        <h2 className="text-xl font-semibold mb-4">
          {customer.first_name} {customer.last_name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Mobile Number</p>
            <p className="font-medium">{customer.mobile_number}</p>
          </div>
          
          {customer.notes && (
            <div className="md:col-span-2">
              <p className="text-gray-600">Notes</p>
              <p className="font-medium whitespace-pre-line">{customer.notes}</p>
            </div>
          )}
          
          <div>
            <p className="text-gray-600">Created At</p>
            <p className="font-medium">
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Booking History</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center">
            <p className="text-gray-600">No bookings found for this customer.</p>
            <Link
              to="/bookings/new"
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Booking
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                        {booking.event?.name || 'Unknown Event'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.event?.start_time
                        ? new Date(booking.event.start_time).toLocaleDateString()
                        : 'Unknown'}
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

export default CustomerDetails; 