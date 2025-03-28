import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../types/database.types';
import { eventService } from '../../services/eventService';
import { formatDate, formatTime } from '../../utils/formatUtils';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Use the service to get real data from Supabase
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${name}"?`)) {
      try {
        // Call the service to delete from Supabase
        await eventService.deleteEvent(id);
        // Update the local state
        setEvents(events.filter(event => event.id !== id));
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event. Please try again.');
      }
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const togglePastEvents = () => {
    setShowPastEvents(prev => !prev);
  };
  
  const getCurrentDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };
  
  const sortAndFilterEvents = (events: Event[]) => {
    const now = getCurrentDate();
    
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start_time);
      const isPastEvent = eventDate < now;
      
      return showPastEvents ? true : !isPastEvent;
    });
    
    const searchFiltered = filteredEvents.filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.category?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    
    return searchFiltered.sort((a, b) => {
      const dateA = new Date(a.start_time).getTime();
      const dateB = new Date(b.start_time).getTime();
      
      return sortDirection === 'asc' 
        ? dateA - dateB
        : dateB - dateA;
    });
  };
  
  const filteredEvents = sortAndFilterEvents(events);

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
  
  const categoryCellStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const dateCellStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const capacityCellStyle: React.CSSProperties = {
    color: '#6B7280'
  };
  
  const actionCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    fontWeight: 500
  };
  
  const editLinkStyle: React.CSSProperties = {
    color: '#4F46E5',
    textDecoration: 'none',
    marginRight: '1rem'
  };
  
  const deleteButtonStyle: React.CSSProperties = {
    color: '#DC2626',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    padding: 0,
    fontSize: '0.875rem'
  };

  const filterContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };
  
  const filterToggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  
  const toggleLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#4B5563'
  };
  
  const checkboxStyle: React.CSSProperties = {
    cursor: 'pointer'
  };
  
  const sortButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#6B7280',
    padding: 0,
    fontSize: '0.75rem',
    fontWeight: 500
  };
  
  const sortIconStyle: React.CSSProperties = {
    marginLeft: '0.25rem',
    fontSize: '0.75rem'
  };
  
  const pastEventRowStyle: React.CSSProperties = {
    ...tableRowStyle,
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF'
  };

  return (
    <div style={pageStyle}>
      <div style={headerContainerStyle}>
        <h1 style={headerStyle}>Events</h1>
        <Link
          to="/events/new"
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          Add Event
        </Link>
      </div>

      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search events..."
          style={inputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={filterContainerStyle}>
        <div style={filterToggleStyle}>
          <input
            type="checkbox"
            id="showPastEvents"
            checked={showPastEvents}
            onChange={togglePastEvents}
            style={checkboxStyle}
          />
          <label htmlFor="showPastEvents" style={toggleLabelStyle}>Show Past Events</label>
        </div>
        <button
          onClick={toggleSortDirection}
          style={sortButtonStyle}
        >
          Sort: {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          <span style={sortIconStyle}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingStyle}>Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ color: '#6B7280' }}>No events found.</p>
          <p style={emptyStateTextStyle}>Create an event to get started.</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead style={tableHeadStyle}>
              <tr>
                <th style={tableHeaderCellStyle}>
                  Name
                </th>
                <th style={tableHeaderCellStyle}>
                  Category
                </th>
                <th style={tableHeaderCellStyle}>
                  <button 
                    style={sortButtonStyle}
                    onClick={toggleSortDirection}
                    title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Date & Time
                    <span style={sortIconStyle}>
                      {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  </button>
                </th>
                <th style={tableHeaderCellStyle}>
                  Capacity
                </th>
                <th style={tableHeaderCellStyle}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={tableBodyStyle}>
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.start_time);
                const isPastEvent = eventDate < getCurrentDate();
                const rowStyle = isPastEvent ? pastEventRowStyle : tableRowStyle;
                
                return (
                  <tr key={event.id} style={rowStyle}>
                    <td style={tableCellStyle}>
                      <div style={nameCellStyle}>
                        <Link 
                          to={`/events/${event.id}`} 
                          style={{...nameLinkStyle, color: isPastEvent ? '#9CA3AF' : '#111827'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#4F46E5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = isPastEvent ? '#9CA3AF' : '#111827';
                          }}
                        >
                          {event.name}
                        </Link>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={categoryCellStyle}>{event.category?.name || 'Unknown'}</div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={dateCellStyle}>
                        {formatDate(event.start_time)} at {formatTime(event.start_time)}
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={capacityCellStyle}>{event.capacity}</div>
                    </td>
                    <td style={actionCellStyle}>
                      <Link
                        to={`/events/${event.id}/edit`}
                        style={editLinkStyle}
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
                        onClick={() => handleDelete(event.id, event.name)}
                        style={deleteButtonStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#B91C1C';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#DC2626';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventList; 