import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Booking } from '../../types/database.types';
import { bookingService } from '../../services/bookingService';
import { formatDateTime } from '../../utils/formatUtils';

const BookingList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get any filter parameters from URL
  const eventId = searchParams.get('eventId');
  const customerId = searchParams.get('customerId');
  
  useEffect(() => {
    loadBookings();
  }, [eventId, customerId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);
      setError(null);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        // In a real app, this would call the API
        // await bookingService.deleteBooking(id);
        // For now, filter out the deleted booking
        setBookings(bookings.filter(booking => booking.id !== id));
      } catch (err) {
        console.error('Error deleting booking:', err);
        setError('Failed to delete booking. Please try again.');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.customer ? 
      `${booking.customer.first_name} ${booking.customer.last_name}`.toLowerCase() : '';
    const eventName = booking.event ? booking.event.name.toLowerCase() : '';
    
    return customerName.includes(searchTerm.toLowerCase()) || 
           eventName.includes(searchTerm.toLowerCase());
  });

  // Common styles
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
  
  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const searchContainerStyle: React.CSSProperties = {
    marginBottom: '1.5rem'
  };
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #D1D5DB',
    padding: '0.5rem',
    borderRadius: '0.375rem'
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem'
  };
  
  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    color: '#6B7280'
  };
  
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.375rem',
    color: '#6B7280'
  };
  
  const emptyStateTextStyle: React.CSSProperties = {
    color: '#6B7280',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
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
  
  const nameCellStyle: React.CSSProperties = {
    fontWeight: 500,
    color: '#111827'
  };
  
  const nameLinkStyle: React.CSSProperties = {
    color: '#111827',
    textDecoration: 'none'
  };
  
  const notesCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    maxWidth: '20rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#6B7280'
  };
  
  const dateCellStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const actionCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const actionLinkStyle: React.CSSProperties = {
    color: '#4F46E5',
    textDecoration: 'none',
    marginRight: '1rem'
  };
  
  const cancelButtonStyle: React.CSSProperties = {
    color: '#DC2626',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    padding: 0,
    fontSize: '0.875rem'
  };

  // Add styles for the badge
  const seatCountBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#E5E7EB',
    color: '#4B5563',
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginLeft: '0.5rem'
  };
  
  const reminderOnlyBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '9999px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginLeft: '0.5rem'
  };

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>Bookings</h1>
        <Link
          to="/bookings/new"
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          Add Booking
        </Link>
      </div>

      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search bookings..."
          style={inputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ color: '#6B7280' }}>No bookings found.</p>
          <p style={emptyStateTextStyle}>Create a booking to get started.</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeadStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>
                  Customer
                </th>
                <th style={tableHeaderCellStyle}>
                  Event
                </th>
                <th style={tableHeaderCellStyle}>
                  Seats
                </th>
                <th style={tableHeaderCellStyle}>
                  Date & Time
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>
                    <div style={nameCellStyle}>
                      {booking.customer ? (
                        <Link 
                          to={`/customers/${booking.customer.id}`} 
                          style={nameLinkStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#4F46E5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          {booking.customer.first_name} {booking.customer.last_name}
                        </Link>
                      ) : (
                        'Unknown Customer'
                      )}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={nameCellStyle}>
                      {booking.event ? (
                        <Link 
                          to={`/events/${booking.event.id}`} 
                          style={nameLinkStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#4F46E5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          {booking.event.name}
                        </Link>
                      ) : (
                        'Unknown Event'
                      )}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    {booking.attendees === 0 ? (
                      <span style={reminderOnlyBadgeStyle}>Reminder Only</span>
                    ) : (
                      <span style={seatCountBadgeStyle}>{booking.attendees} {booking.attendees === 1 ? 'Seat' : 'Seats'}</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <div style={dateCellStyle}>
                      {booking.event ? formatDateTime(booking.event.start_time) : 'Unknown'}
                    </div>
                  </td>
                  <td style={notesCellStyle}>
                    {booking.notes || '-'}
                  </td>
                  <td style={actionCellStyle}>
                    <Link
                      to={`/bookings/${booking.id}`}
                      style={actionLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
                    >
                      View
                    </Link>
                    <Link
                      to={`/bookings/${booking.id}/edit`}
                      style={actionLinkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4338CA';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#4F46E5';
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      style={cancelButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#B91C1C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#DC2626';
                      }}
                    >
                      Cancel
                    </button>
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

export default BookingList; 