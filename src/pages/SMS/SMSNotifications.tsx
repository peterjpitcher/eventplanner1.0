import React, { useState, useEffect, useRef } from 'react';
import { Customer, Event } from '../../types/database.types';
import { customerService } from '../../services/customerService';
import { SMS_TEMPLATES, smsService } from '../../services/smsService';
import { eventService } from '../../services/eventService';
import { bookingService } from '../../services/bookingService';
import { formatDateTime } from '../../utils/formatUtils';

const SMSNotifications: React.FC = () => {
  // State for customer selection for individual messages
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  
  // State for logs
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  
  // Status and loading states
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [isTwilioConfigured, setIsTwilioConfigured] = useState<boolean>(false);
  
  useEffect(() => {
    loadData();
    // Check if Twilio is properly configured
    setIsTwilioConfigured(smsService.isTwilioConfigured());
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load customers, events and SMS logs in parallel
      const [customersData, eventsData, smsLogsData] = await Promise.all([
        customerService.getAllCustomers(),
        eventService.getAllEvents(),
        smsService.getSMSLogs()
      ]);
      
      setCustomers(customersData);
      setEvents(eventsData);
      setSmsLogs(smsLogsData);
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendCustomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId) {
      setResult({ 
        success: false, 
        message: 'Please select a customer.' 
      });
      return;
    }
    
    if (!customMessage.trim()) {
      setResult({ 
        success: false, 
        message: 'Please enter a message.' 
      });
      return;
    }
    
    try {
      setSendingMessage(true);
      setResult(null);
      
      // Find the selected customer
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (!customer) {
        throw new Error('Selected customer not found.');
      }
      
      // Send the message using the SMS service
      const result = await smsService.sendCustomMessage(customer, customMessage);
      
      // Refresh the SMS logs after sending
      const updatedLogs = await smsService.getSMSLogs();
      setSmsLogs(updatedLogs);
      
      setResult(result);
      if (result.success) {
        setCustomMessage('');
      }
    } catch (error) {
      console.error('Error sending custom message:', error);
      setResult({ 
        success: false, 
        message: `Failed to send message: ${error}` 
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleSendEventReminders = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEventId) {
      setResult({ 
        success: false, 
        message: 'Please select an event.' 
      });
      return;
    }
    
    try {
      setSendingReminders(true);
      setResult(null);
      
      // Find the selected event
      const event = events.find(e => e.id === selectedEventId);
      if (!event) {
        throw new Error('Selected event not found.');
      }
      
      // Get all bookings for this event
      const bookings = await bookingService.getBookingsByEvent(event.id);
      
      // Send reminders to all customers with bookings
      let successCount = 0;
      let failedCount = 0;
      
      for (const booking of bookings) {
        const customer = await customerService.getCustomerById(booking.customer_id);
        if (customer) {
          const eventTime = new Date(event.start_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const result = await smsService.sendEventReminder(
            customer,
            event.name,
            eventTime
          );
          
          if (result.success) {
            successCount++;
          } else {
            failedCount++;
          }
        }
      }
      
      // Refresh SMS logs
      const updatedLogs = await smsService.getSMSLogs();
      setSmsLogs(updatedLogs);
      
      setResult({
        success: true,
        message: `Reminders sent: ${successCount} successful, ${failedCount} failed.`
      });
    } catch (error) {
      console.error('Error sending event reminders:', error);
      setResult({ 
        success: false, 
        message: `Failed to send reminders: ${error}` 
      });
    } finally {
      setSendingReminders(false);
    }
  };
  
  // Define styles
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    padding: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };
  
  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  };
  
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  };
  
  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#111827'
  };
  
  const templateContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };
  
  const templateItemStyle: React.CSSProperties = {
  };
  
  const templateItemTitleStyle: React.CSSProperties = {
    fontWeight: 500,
    color: '#111827'
  };
  
  const templateTextStyle: React.CSSProperties = {
    color: '#4B5563',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    backgroundColor: '#F9FAFB',
    padding: '0.5rem',
    borderRadius: '0.375rem'
  };
  
  const resultMessageStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: '0.375rem'
  };
  
  const twoColumnLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  };
  
  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };
  
  const formGroupStyle: React.CSSProperties = {
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };
  
  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    color: '#111827'
  };
  
  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    color: '#111827'
  };
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer'
  };
  
  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.7,
    cursor: 'not-allowed'
  };
  
  const helperTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#6B7280'
  };
  
  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto'
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
    fontSize: '0.875rem',
    whiteSpace: 'nowrap'
  };
  
  const tableCellMessageStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    fontSize: '0.875rem'
  };
  
  const messageContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '20rem'
  };
  
  const statusBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600
  };
  
  const errorMessageStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#DC2626',
    marginTop: '0.25rem'
  };
  
  const loadingTextStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1rem 0',
    color: '#6B7280'
  };
  
  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1rem 0',
    color: '#6B7280'
  };
  
  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>SMS Notifications</h1>
      
      {/* SMS Service Information */}
      {!isTwilioConfigured && (
        <div className="alert alert-info mt-3">
          <h4>SMS Service Information</h4>
          <p>
            The SMS service is configured to use UK phone numbers (format: 07XXX XXX XXX).
            Messages are processed through a secure server-side API that handles proper authentication.
          </p>
        </div>
      )}
      
      {/* Display notification templates */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Message Templates</h2>
        <div style={templateContainerStyle}>
          <div style={templateItemStyle}>
            <h3 style={templateItemTitleStyle}>Booking Confirmation</h3>
            <p style={templateTextStyle}>
              {SMS_TEMPLATES.BOOKING_CONFIRMATION}
            </p>
          </div>
          <div style={templateItemStyle}>
            <h3 style={templateItemTitleStyle}>Event Reminder</h3>
            <p style={templateTextStyle}>
              {SMS_TEMPLATES.EVENT_REMINDER}
            </p>
          </div>
          <div style={templateItemStyle}>
            <h3 style={templateItemTitleStyle}>Booking Cancellation</h3>
            <p style={templateTextStyle}>
              {SMS_TEMPLATES.BOOKING_CANCELLATION}
            </p>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      {result && (
        <div style={{
          ...resultMessageStyle,
          backgroundColor: result.success ? '#DCFCE7' : '#FEE2E2',
          color: result.success ? '#166534' : '#B91C1C'
        }}>
          {result.message}
        </div>
      )}
      
      <div style={twoColumnLayoutStyle}>
        {/* Send custom message to individual customer */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Send Custom Message</h2>
          <form onSubmit={handleSendCustomMessage} style={formStyle}>
            <div style={formGroupStyle}>
              <label 
                style={labelStyle} 
                htmlFor="customer"
              >
                Customer *
              </label>
              <select
                id="customer"
                style={selectStyle}
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                disabled={sendingMessage}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} - {customer.mobile_number}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={formGroupStyle}>
              <label 
                style={labelStyle} 
                htmlFor="message"
              >
                Message *
              </label>
              <textarea
                id="message"
                style={textareaStyle}
                rows={4}
                placeholder="Enter your message here"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                disabled={sendingMessage}
                required
              />
            </div>
            
            <button
              type="submit"
              style={sendingMessage ? disabledButtonStyle : buttonStyle}
              disabled={sendingMessage}
              onMouseEnter={(e) => {
                if (!sendingMessage) {
                  e.currentTarget.style.backgroundColor = '#4338CA';
                }
              }}
              onMouseLeave={(e) => {
                if (!sendingMessage) {
                  e.currentTarget.style.backgroundColor = '#4F46E5';
                }
              }}
            >
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        
        {/* Send event reminders */}
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Send Event Reminders</h2>
          <form onSubmit={handleSendEventReminders} style={formStyle}>
            <div style={formGroupStyle}>
              <label 
                style={labelStyle} 
                htmlFor="event"
              >
                Event *
              </label>
              <select
                id="event"
                style={selectStyle}
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={sendingReminders}
                required
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {formatDateTime(event.start_time)}
                  </option>
                ))}
              </select>
            </div>
            
            <p style={helperTextStyle}>
              This will send a reminder to all customers who have booked this event.
            </p>
            
            <button
              type="submit"
              style={sendingReminders ? disabledButtonStyle : buttonStyle}
              disabled={sendingReminders}
              onMouseEnter={(e) => {
                if (!sendingReminders) {
                  e.currentTarget.style.backgroundColor = '#4338CA';
                }
              }}
              onMouseLeave={(e) => {
                if (!sendingReminders) {
                  e.currentTarget.style.backgroundColor = '#4F46E5';
                }
              }}
            >
              {sendingReminders ? 'Sending...' : 'Send Reminders'}
            </button>
          </form>
        </div>
      </div>
      
      {/* SMS logs */}
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>SMS Logs</h2>
        
        {loading ? (
          <div style={loadingTextStyle}>Loading SMS logs...</div>
        ) : smsLogs.length === 0 ? (
          <div style={emptyStateStyle}>No SMS logs found.</div>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead style={tableHeadStyle}>
                <tr>
                  <th style={tableHeaderCellStyle}>
                    Time
                  </th>
                  <th style={tableHeaderCellStyle}>
                    Phone Number
                  </th>
                  <th style={tableHeaderCellStyle}>
                    Message
                  </th>
                  <th style={tableHeaderCellStyle}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody style={tableBodyStyle}>
                {smsLogs.map((log) => (
                  <tr key={log.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>
                      {formatDateTime(log.created_at)}
                    </td>
                    <td style={tableCellStyle}>
                      {log.phone_number}
                    </td>
                    <td style={tableCellMessageStyle}>
                      <div style={messageContainerStyle}>{log.message_body}</div>
                    </td>
                    <td style={tableCellStyle}>
                      <span 
                        style={{
                          ...statusBadgeStyle,
                          backgroundColor: log.success ? '#DCFCE7' : '#FEE2E2',
                          color: log.success ? '#166534' : '#B91C1C'
                        }}
                      >
                        {log.success ? 'Sent' : 'Failed'}
                      </span>
                      {!log.success && log.error_message && (
                        <div style={errorMessageStyle}>
                          {log.error_message}
                        </div>
                      )}
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

export default SMSNotifications; 