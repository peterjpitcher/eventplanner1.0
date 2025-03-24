import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import { eventCategoryService } from '../services/eventCategoryService';
import { Event, Booking } from '../types/database.types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalCategories: 0
  });
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [customers, events, bookings, categories] = await Promise.all([
        customerService.getAllCustomers(),
        eventService.getAllEvents(),
        bookingService.getAllBookings(),
        eventCategoryService.getAllCategories()
      ]);
      
      // Update stats
      setStats({
        totalCustomers: customers.length,
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalCategories: categories.length
      });
      
      // Sort events by date (upcoming first)
      const sortedEvents = [...events].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      
      // Sort bookings by creation date (most recent first)
      const sortedBookings = [...bookings].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setUpcomingEvents(sortedEvents.slice(0, 5));
      setRecentBookings(sortedBookings.slice(0, 5));
      setError(null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format date string to local format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format time string to local format
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  // Get status class for event based on capacity
  const getEventStatusClass = (event: Event): React.CSSProperties => {
    // Assume remaining_capacity might be undefined if not populated
    const remainingCapacity = event.remaining_capacity ?? 0;
    const percentFull = ((event.capacity - remainingCapacity) / event.capacity) * 100;
    
    if (percentFull >= 90) return { backgroundColor: '#FEE2E2', color: '#B91C1C' };
    if (percentFull >= 70) return { backgroundColor: '#FEF3C7', color: '#92400E' };
    return { backgroundColor: '#DCFCE7', color: '#166534' };
  };

  // Styles
  const pageStyle: React.CSSProperties = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };
  
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };
  
  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  };
  
  const statCardStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const sectionStyle: React.CSSProperties = {
    marginBottom: '2rem'
  };
  
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };
  
  const thStyle: React.CSSProperties = {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    fontWeight: 500
  };
  
  const tdStyle: React.CSSProperties = {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb'
  };
  
  const cardContainerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem'
  };
  
  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };
  
  const actionButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.25rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  if (loading) {
    return (
      <div style={pageStyle}>
        <h1 style={{ ...headerStyle, justifyContent: 'center' }}>Loading dashboard...</h1>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={pageStyle}>
        <h1 style={{ ...headerStyle, justifyContent: 'center' }}>{error}</h1>
        <button 
          onClick={loadDashboardData} 
          style={{ ...actionButtonStyle, margin: '0 auto', display: 'block' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h1>
        <div>
          <Link to="/bookings/new" style={actionButtonStyle}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>New Booking</span>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Customers</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalCustomers}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Events</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalEvents}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Bookings</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalBookings}</span>
        </div>
        <div style={statCardStyle}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Event Categories</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalCategories}</span>
        </div>
      </div>
      
      {/* Upcoming Events Section */}
      <div style={sectionStyle}>
        <div style={cardContainerStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Upcoming Events</h2>
            <Link to="/events" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map(event => (
                  <tr key={event.id}>
                    <td style={tdStyle}>
                      <Link to={`/events/${event.id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                        {event.name}
                      </Link>
                    </td>
                    <td style={tdStyle}>{formatDate(event.start_time)}</td>
                    <td style={tdStyle}>{formatTime(event.start_time)}</td>
                    <td style={tdStyle}>{event.category?.name || 'Unknown'}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        ...getEventStatusClass(event)
                      }}>
                        {event.remaining_capacity ?? 0}/{event.capacity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No upcoming events</p>
          )}
        </div>
      </div>
      
      {/* Recent Bookings Section */}
      <div style={sectionStyle}>
        <div style={cardContainerStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Recent Bookings</h2>
            <Link to="/bookings" style={{ fontSize: '0.875rem', color: '#3b82f6', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          
          {recentBookings.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Event</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Attendees</th>
                  <th style={thStyle}>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={tdStyle}>
                      <Link to={`/customers/${booking.customer_id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                        {booking.customer?.first_name} {booking.customer?.last_name}
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      <Link to={`/events/${booking.event_id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {booking.event?.name}
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      {booking.event ? formatDate(booking.event.start_time) : 'Unknown'}
                    </td>
                    <td style={tdStyle}>{booking.attendees}</td>
                    <td style={tdStyle}>{formatDate(booking.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No recent bookings</p>
          )}
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <div style={cardContainerStyle}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <Link to="/customers/new" style={{ 
              ...actionButtonStyle,
              textAlign: 'center',
              backgroundColor: '#4338ca'
            }}>Create New Customer</Link>
            
            <Link to="/events/new" style={{ 
              ...actionButtonStyle,
              textAlign: 'center',
              backgroundColor: '#0891b2'
            }}>Create New Event</Link>
            
            <Link to="/bookings/new" style={{ 
              ...actionButtonStyle,
              textAlign: 'center'
            }}>Create New Booking</Link>
            
            <Link to="/categories/new" style={{ 
              ...actionButtonStyle,
              textAlign: 'center',
              backgroundColor: '#7c3aed'
            }}>Create New Category</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 