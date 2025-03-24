import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import { eventCategoryService } from '../services/eventCategoryService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalCategories: 0
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for development
        // In a real app, this would be replaced with actual API calls
        const mockCustomers = Array(15).fill(null).map((_, i) => ({
          id: i + 1,
          first_name: 'Customer',
          last_name: `${i + 1}`,
          email: `customer${i + 1}@example.com`,
          mobile_number: `+1234567890${i}`
        }));
        
        const mockEvents = Array(8).fill(null).map((_, i) => ({
          id: i + 1,
          name: `Event ${i + 1}`,
          date: new Date(Date.now() + (i * 86400000)).toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '17:00',
          location: `Location ${i + 1}`,
          capacity: 50,
          bookings: Array(Math.floor(Math.random() * 30)).fill(null),
          category: { id: i % 4 + 1, name: `Category ${i % 4 + 1}` }
        }));
        
        const mockBookings = Array(10).fill(null).map((_, i) => ({
          id: i + 1,
          customer: mockCustomers[i % mockCustomers.length],
          event: mockEvents[i % mockEvents.length],
          status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          bookingDate: new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
          customerName: `${mockCustomers[i % mockCustomers.length].first_name} ${mockCustomers[i % mockCustomers.length].last_name}`,
          eventName: mockEvents[i % mockEvents.length].name,
          created_at: new Date(Date.now() - (i * 86400000)).toISOString()
        }));
        
        const mockCategories = Array(4).fill(null).map((_, i) => ({
          id: i + 1,
          name: `Category ${i + 1}`
        }));
        
        // Set mock data
        setStats({
          totalCustomers: mockCustomers.length,
          totalEvents: mockEvents.length,
          totalBookings: mockBookings.length,
          totalCategories: mockCategories.length
        });
        
        setUpcomingEvents(mockEvents.slice(0, 5));
        setRecentBookings(mockBookings.slice(0, 5));
        
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Helper function for formatting time - keeping for future use
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getEventStatusClass = (event: any) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < today) {
      return "text-red-600";
    } else if (eventDate.getDate() === today.getDate() && 
               eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear()) {
      return "text-yellow-600";
    } else {
      return "text-green-600";
    }
  };
  
  // Styles
  const pageStyle: React.CSSProperties = {
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };
  
  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#111827'
  };
  
  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  };
  
  const statCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  };
  
  const iconContainerStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const iconStyle: React.CSSProperties = {
    width: '1.5rem',
    height: '1.5rem',
    color: 'currentColor'
  };
  
  const statTextContainerStyle: React.CSSProperties = {
    marginLeft: '1rem'
  };
  
  const statLabelStyle: React.CSSProperties = {
    color: '#6B7280',
    fontSize: '0.875rem'
  };
  
  const statValueStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 600
  };
  
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };
  
  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#111827'
  };
  
  const quickActionsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem'
  };
  
  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    border: '1px solid #E5E7EB',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: '#111827',
    transition: 'all 0.2s'
  };
  
  const twoColumnLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  };
  
  const itemCardStyle: React.CSSProperties = {
    border: '1px solid #E5E7EB',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem'
  };
  
  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '2.5rem 0',
    color: '#6B7280'
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: '#FEE2E2',
    borderLeft: '4px solid #EF4444',
    color: '#B91C1C',
    padding: '1rem',
    marginBottom: '1rem'
  };
  
  if (loading) {
    return <div style={loadingStyle}>Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }
  
  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <div style={{ ...iconContainerStyle, backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div style={statTextContainerStyle}>
            <p style={statLabelStyle}>Total Customers</p>
            <p style={statValueStyle}>{stats.totalCustomers}</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...iconContainerStyle, backgroundColor: '#DCFCE7', color: '#16A34A' }}>
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div style={statTextContainerStyle}>
            <p style={statLabelStyle}>Total Events</p>
            <p style={statValueStyle}>{stats.totalEvents}</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...iconContainerStyle, backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div style={statTextContainerStyle}>
            <p style={statLabelStyle}>Total Bookings</p>
            <p style={statValueStyle}>{stats.totalBookings}</p>
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ ...iconContainerStyle, backgroundColor: '#E0F2FE', color: '#0EA5E9' }}>
            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div style={statTextContainerStyle}>
            <p style={statLabelStyle}>Total Categories</p>
            <p style={statValueStyle}>{stats.totalCategories}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Quick Actions</h2>
        <div style={quickActionsStyle}>
          <Link 
            to="/customers/new" 
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <svg style={{ color: '#4F46E5', width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Add Customer</span>
          </Link>
          
          <Link 
            to="/events/new" 
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <svg style={{ color: '#16A34A', width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Create Event</span>
          </Link>
          
          <Link 
            to="/bookings/new" 
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <svg style={{ color: '#0EA5E9', width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>New Booking</span>
          </Link>
          
          <Link 
            to="/sms-notifications" 
            style={actionButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <svg style={{ color: '#8B5CF6', width: '1.5rem', height: '1.5rem', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Send SMS</span>
          </Link>
        </div>
      </div>
      
      <div style={twoColumnLayoutStyle}>
        {/* Upcoming Events */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Upcoming Events</h2>
          
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <svg style={{ width: '3rem', height: '3rem', margin: '0 auto', color: '#D1D5DB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>No upcoming events scheduled.</p>
              <Link to="/events/new" style={{ 
                display: 'inline-block', 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#4F46E5', 
                color: 'white', 
                borderRadius: '0.375rem', 
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                Create New Event
              </Link>
            </div>
          ) : (
            <div>
              {upcomingEvents.map((event) => (
                <div key={event.id} style={itemCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Link 
                        to={`/events/${event.id}`} 
                        style={{ fontWeight: 500, fontSize: '1rem', color: '#111827', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                      >
                        {event.name}
                      </Link>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                        {formatDate(event.date)}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                        Category: {event.category?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        color: '#16A34A',
                        backgroundColor: '#DCFCE7'
                      }}>
                        Available
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600 }}>{event.bookings?.length || 0}</span> / {event.capacity} booked
                    </div>
                    <Link 
                      to={`/bookings/new?eventId=${event.id}`} 
                      style={{ 
                        fontSize: '0.75rem', 
                        backgroundColor: '#4F46E5', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4338CA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
                    >
                      Add Booking
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Bookings */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Recent Bookings</h2>
          
          {recentBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <svg style={{ width: '3rem', height: '3rem', margin: '0 auto', color: '#D1D5DB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>No recent bookings found.</p>
              <Link to="/bookings/new" style={{ 
                display: 'inline-block', 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                backgroundColor: '#4F46E5', 
                color: 'white', 
                borderRadius: '0.375rem', 
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                Create New Booking
              </Link>
            </div>
          ) : (
            <div>
              {recentBookings.map((booking) => (
                <div key={booking.id} style={itemCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Link 
                        to={`/customers/${booking.customer?.id}`} 
                        style={{ fontWeight: 500, color: '#111827', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                      >
                        {booking.customerName}
                      </Link>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {booking.customer?.mobile_number || 'No phone number'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Booked on {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <Link 
                      to={`/events/${booking.event?.id}`} 
                      style={{ color: '#4F46E5', textDecoration: 'none', fontSize: '0.875rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#4338CA'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#4F46E5'}
                    >
                      {booking.eventName || 'Unknown Event'}
                    </Link>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      color: booking.status === 'confirmed' ? '#16A34A' : booking.status === 'pending' ? '#D97706' : '#DC2626',
                      backgroundColor: booking.status === 'confirmed' ? '#DCFCE7' : booking.status === 'pending' ? '#FEF3C7' : '#FEE2E2'
                    }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <Link 
                      to={`/bookings/${booking.id}`} 
                      style={{ 
                        fontSize: '0.75rem',
                        color: '#4F46E5',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 