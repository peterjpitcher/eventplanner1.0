# Event Management System v1.1 Technical Specifications

This document outlines the technical specifications for implementing the v1.1 enhancements to the Event Management System.

## 1. UI Enhancements

### 1.1 Event Category Edit Form Fix

**Current Issue:**
- Form displays metadata (e.g., "Category f3ae60ee-1ecb-4bbb-843d-946a2384ebc3") instead of actual values

**Technical Solution:**
- Investigate data binding in the event category edit component
- Fix the data mapping to ensure actual values are displayed
- Update component to handle data loading states properly

**Component Location:** `/components/EventCategories/EditEventCategoryForm.jsx`

### 1.2 Event Creation Category Default

**Current Issue:**
- Category selector automatically selects an option
- Default values only apply when clicking off and back on selected category

**Technical Solution:**
- Add "Select a category" placeholder option in the dropdown
- Make this the default selected value
- Modify `onChange` handler to only apply defaults when a real category is selected
- Update form validation to require explicit category selection

**Component Location:** `/components/Events/CreateEventForm.jsx`

### 1.3 Allow Zero Seats for Reminder-Only Bookings

**Current Issue:**
- Cannot set seats to 0 for reminder-only bookings

**Technical Solution:**
- Modify form validation to accept 0 as valid seat count
- Add indicator for reminder-only bookings
- Update database queries to handle 0-seat bookings properly

**Component Location:** `/components/Bookings/CreateBookingForm.jsx`

### 1.4 Date and Time Format Standardization

**Technical Solution:**
- Create utility functions:
  ```javascript
  // Format date as "March 28, 2024"
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Format time as "9pm", "6:30pm"
  export const formatTime = (time) => {
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString('en-GB', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }).toLowerCase().replace(' ', '').replace(':00', '');
  }
  ```
- Apply these functions across all components that display dates and times

**Utility Location:** `/utils/formatters.js`

### 1.5 Display Notes in Views

**Technical Solution:**
- Identify all customer, event, and booking view components
- Add consistent notes display section to each view
- Style notes field consistently across the application

**Component Locations:**
- `/components/Customers/CustomerDetails.jsx`
- `/components/Events/EventDetails.jsx`
- `/components/Bookings/BookingDetails.jsx`

## 2. Data Management Enhancements

### 2.1 Sorting Implementation

**Technical Solution:**
- Customers: Sort alphabetically by concatenated first_name + last_name
  ```javascript
  customers.sort((a, b) => 
    (a.first_name + ' ' + a.last_name)
      .localeCompare(b.first_name + ' ' + b.last_name)
  );
  ```
- Events: Sort chronologically by start_time
  ```javascript
  events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  ```
- Bookings: Group by event and sort alphabetically by customer name within groups
  ```javascript
  // Group bookings by event
  const bookingsByEvent = bookings.reduce((acc, booking) => {
    if (!acc[booking.event_id]) {
      acc[booking.event_id] = [];
    }
    acc[booking.event_id].push(booking);
    return acc;
  }, {});
  
  // Sort customers within each event group
  Object.keys(bookingsByEvent).forEach(eventId => {
    bookingsByEvent[eventId].sort((a, b) => 
      (a.customer.first_name + ' ' + a.customer.last_name)
        .localeCompare(b.customer.first_name + ' ' + b.customer.last_name)
    );
  });
  ```

**Component Locations:**
- `/components/Customers/CustomersList.jsx`
- `/components/Events/EventsList.jsx`
- `/components/Bookings/BookingsList.jsx`

### 2.2 Event Capacity Display

**Technical Solution:**
- Modify event queries to include booking count information
- Calculate and display booked/total capacity ratio
- Update UI to show this information in the event list and detail views

**SQL Query Example:**
```sql
SELECT 
  e.*,
  COUNT(b.id) as booked_seats,
  COALESCE(SUM(b.seats), 0) as total_booked_seats
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id
GROUP BY e.id;
```

**Component Locations:**
- `/components/Events/EventsList.jsx`
- `/components/Events/EventDetails.jsx`

### 2.3 Past Events Toggle

**Technical Solution:**
- Add filter state for showing past events
- Default to showing only future events
- Add toggle UI for switching between views
- Modify event queries to filter by date based on toggle state

**Component Location:** `/components/Events/EventsList.jsx`

## 3. SMS Templates & Variables

### 3.1 SMS Template Updates

**Templates to Update:**
1. Booking confirmation
2. Reminder confirmation
3. Booking cancellation
4. 7-day reminder
5. 24-hour reminder

**Available Variables:**
- `{{customerName}}` - Full name of the customer
- `{{eventName}}` - Name of the event
- `{{eventDate}}` - Formatted date of the event
- `{{eventTime}}` - Formatted time of the event
- `{{venueDetails}}` - Event venue information
- `{{seatsBooked}}` - Number of seats booked

**Template Examples:**
```
// Booking confirmation
Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} at {{eventTime}} has been confirmed. We look forward to seeing you!

// 7-day reminder
Hi {{customerName}}, just a reminder that you're booked for {{eventName}} on {{eventDate}} at {{eventTime}}. We look forward to seeing you!

// 24-hour reminder
Hi {{customerName}}, your booking for {{eventName}} is tomorrow at {{eventTime}}. We look forward to seeing you!
```

**Component Location:** `/components/SMS/SMSTemplates.jsx`

## 4. Automation with GitHub Actions

### 4.1 API Endpoint for Reminders

**New API Endpoint:**
- Path: `/api/cron/process-reminders`
- Method: POST
- Authentication: Bearer token

**Endpoint Functionality:**
1. Verify authentication
2. Query database for events in the next 7 days and 24 hours
3. Process SMS sending for relevant bookings
4. Log all SMS activities

**Code Location:** `/pages/api/cron/process-reminders.js`

### 4.2 GitHub Actions Workflow

**Workflow Configuration:**
```yaml
name: Daily SMS Reminders

on:
  schedule:
    # Run at 9am UTC daily
    - cron: '0 9 * * *'

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger reminders API
        uses: actions/http-client@v1
        with:
          url: 'https://[your-domain]/api/cron/process-reminders'
          method: 'POST'
          headers: |
            Authorization: Bearer ${{ secrets.REMINDER_API_TOKEN }}
            Content-Type: application/json
          body: |
            {
              "source": "github-actions"
            }
```

**Location:** `.github/workflows/daily-reminders.yml`

### 4.3 Reminder Processing Logic

**7-Day Reminder Query:**
```javascript
const sevenDayEvents = await supabase
  .from('events')
  .select(`
    id,
    name,
    start_time,
    bookings (
      id,
      customer:customers (
        id,
        first_name,
        last_name,
        mobile_number
      ),
      seats
    )
  `)
  .gte('start_time', new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString())
  .lt('start_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
```

**24-Hour Reminder Query:**
```javascript
const oneDayEvents = await supabase
  .from('events')
  .select(`
    id,
    name,
    start_time,
    bookings (
      id,
      customer:customers (
        id,
        first_name,
        last_name,
        mobile_number
      ),
      seats
    )
  `)
  .gte('start_time', new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString())
  .lt('start_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
```

**Location:** `/lib/reminderService.js`

## 5. UI Component Updates

### 5.1 Booking List with Accordions

**Technical Solution:**
- Implement accordion-style UI for bookings grouped by event
- Show event details in accordion header
- Display bookings for each event when expanded
- Include seat count and reminder-only indicators

**Component Structure:**
```jsx
<div className="bookings-list">
  {Object.entries(bookingsByEvent).map(([eventId, bookings]) => (
    <Accordion key={eventId}>
      <AccordionSummary>
        <div className="event-header">
          <h3>{events[eventId].name}</h3>
          <span>{formatDate(events[eventId].start_time)} at {formatTime(events[eventId].start_time)}</span>
          <span>{bookings.length} bookings</span>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Seats</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.customer.first_name} {booking.customer.last_name}</td>
                <td>
                  {booking.seats === 0 ? 
                    <span className="reminder-only-badge">Reminder Only</span> :
                    booking.seats
                  }
                </td>
                <td>{booking.notes}</td>
                <td>[Actions]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  ))}
</div>
```

**Component Location:** `/components/Bookings/BookingsList.jsx`

## 6. Removing Manual Reminder Component

**Component to Remove:** `/components/SMS/SendEventReminders.jsx`

**Technical Solution:**
- Remove component from UI
- Remove related navigation items
- Update any dependencies
- Ensure routes are updated accordingly 