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

  // Define styles
  const pageStyle: React.CSSProperties = {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem'
  };

  const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    textDecoration: 'none'
  };

  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: '#DC2626',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.375rem',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#111827'
  };

  const gridContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    color: '#6B7280'
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  };

  const errorButtonStyle: React.CSSProperties = {
    backgroundColor: '#DC2626',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem'
  };

  const notFoundStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    color: '#6B7280'
  };

  const notFoundButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  const fieldLabelStyle: React.CSSProperties = {
    color: '#6B7280'
  };

  const fieldValueStyle: React.CSSProperties = {
    fontWeight: 500
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    marginTop: '2rem',
    color: '#111827'
  };

  const emptyBookingsStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB',
    padding: '1.5rem',
    borderRadius: '0.375rem',
    textAlign: 'center',
    color: '#6B7280'
  };

  const createBookingButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '1rem'
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    overflow: 'hidden'
  };

  const tableStyle: React.CSSProperties = {
    minWidth: '100%',
    borderCollapse: 'collapse'
  };

  const tableHeadStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB'
  };

  const tableHeaderCellStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const tableBodyStyle: React.CSSProperties = {
    backgroundColor: 'white'
  };

  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid #E5E7EB'
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap'
  };

  const viewLinkStyle: React.CSSProperties = {
    color: '#4F46E5',
    textDecoration: 'none'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading customer details...</div>;
  }

  if (error) {
    return (
      <div style={errorStyle} role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/customers')}
          style={errorButtonStyle}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={notFoundStyle}>
        <p style={{ color: '#6B7280' }}>Customer not found.</p>
        <button 
          onClick={() => navigate('/customers')}
          style={notFoundButtonStyle}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>Customer Details</h1>
        <div style={buttonContainerStyle}>
          <Link
            to={`/customers/${id}/edit`}
            style={editButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            style={deleteButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B91C1C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
            }}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
          {customer.first_name} {customer.last_name}
        </h2>
        
        <div style={gridContainerStyle}>
          <div>
            <p style={fieldLabelStyle}>Mobile Number</p>
            <p style={fieldValueStyle}>{customer.mobile_number}</p>
          </div>
          
          <div>
            <p style={fieldLabelStyle}>Created At</p>
            <p style={fieldValueStyle}>
              {new Date(customer.created_at).toLocaleDateString()}
            </p>
          </div>
          
          {customer.notes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={fieldLabelStyle}>Notes</p>
              <p style={fieldValueStyle}>{customer.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <h2 style={sectionTitleStyle}>Booking History</h2>
      
      {bookings.length === 0 ? (
        <div style={emptyBookingsStyle}>
          <p>No bookings found for this customer.</p>
          <Link
            to={`/bookings/new?customerId=${id}`}
            style={createBookingButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
            }}
          >
            Create New Booking
          </Link>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeadStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>
                  Event
                </th>
                <th style={tableHeaderCellStyle}>
                  Date
                </th>
                <th style={tableHeaderCellStyle}>
                  Notes
                </th>
                <th style={tableHeaderCellStyle}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={tableBodyStyle}>
              {bookings.map((booking) => (
                <tr key={booking.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>
                      {booking.event?.name || 'Unknown Event'}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ color: '#6B7280' }}>
                      {booking.event?.start_time
                        ? new Date(booking.event.start_time).toLocaleDateString()
                        : 'Unknown'}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ color: '#6B7280', maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {booking.notes || '-'}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <Link
                      to={`/bookings/${booking.id}`}
                      style={viewLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
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
  );
};

export default CustomerDetails; 