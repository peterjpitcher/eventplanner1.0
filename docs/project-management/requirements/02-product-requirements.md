# Product Requirements Document (PRD)
## Event Management System for Pub Events

### 1. Overview
A simple, efficient web application for managing pub events, customer registrations, and bookings with SMS notifications.

### 2. Technical Stack
- **Frontend**: React with TypeScript
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **SMS Service**: Twilio
- **Deployment**: Vercel
- **Version Control**: GitHub

### 3. Core Features

#### 3.1 Customer Management
- **Customer Registration**
  - First name
  - Last name
  - Mobile number (UK format: 07XXX XXX XXX)
  - Optional notes field
- **Customer List View**
  - Search functionality
  - Quick access to customer details and booking history
- **Phone Number Requirements**
  - UK mobile numbers must be stored in local format (07XXX XXX XXX)
  - Numbers are converted to international format (+44XXXXXXXXX) when sending SMS via Twilio
  - Validation ensures only valid UK mobile numbers are accepted

#### 3.2 Event Management
- **Event Category Management**
  - Category name
  - Default capacity
  - Default start time
  - Category notes
- **Event Creation**
  - Event name
  - Event category (with auto-filled defaults)
  - Capacity limit (editable)
  - Start time (editable)
  - Event notes
- **Event List View**
  - Calendar view of upcoming events
  - Quick access to event details and bookings
  - Capacity tracking

#### 3.3 Booking Management
- **Booking Creation**
  - Link customer to event
  - Booking notes
  - Automatic capacity check
- **Booking List View**
  - Filter by event
  - Filter by date
  - Quick access to customer details

#### 3.4 SMS Notifications
- **Automated Messages**
  - Booking confirmation
  - Booking cancellation
  - Event cancellation (mass message)
  - 7-day reminder
  - 24-hour reminder
- **Message Templates**
  - Customizable message content
  - Support for event details in messages

### 4. User Interface Requirements

#### 4.1 Design Principles
- Clean, minimalist interface
- Fast, efficient workflows
- Desktop-optimized (mobile responsiveness not required)
- Quick access to common actions

#### 4.2 Key Screens
1. **Dashboard**
   - Overview of upcoming events
   - Quick actions for common tasks
   - Recent bookings

2. **Customers**
   - List view with search
   - Add/Edit customer form
   - Customer details view

3. **Events**
   - Calendar view
   - List view
   - Add/Edit event form
   - Event details view

4. **Bookings**
   - List view with filters
   - Add/Edit booking form
   - Booking details view

### 5. Data Structure

#### 5.1 Supabase Tables
1. **customers**
   - id (uuid)
   - first_name (text)
   - last_name (text)
   - mobile_number (text)
   - notes (text)
   - created_at (timestamp)

2. **event_categories**
   - id (uuid)
   - name (text)
   - default_capacity (integer)
   - default_start_time (time)
   - notes (text)
   - created_at (timestamp)

3. **events**
   - id (uuid)
   - name (text)
   - category_id (uuid, foreign key)
   - capacity (integer)
   - start_time (timestamp)
   - notes (text)
   - created_at (timestamp)

4. **bookings**
   - id (uuid)
   - customer_id (uuid, foreign key)
   - event_id (uuid, foreign key)
   - notes (text)
   - created_at (timestamp)

### 6. Security Requirements
- Supabase authentication required for all access
- Secure storage of Twilio credentials
- Input validation and sanitization
- Protection against SQL injection

### 7. Performance Requirements
- Page load time < 2 seconds
- Booking creation < 1 second
- SMS delivery confirmation tracking
- Efficient database queries

### 8. Future Considerations
- Potential for recurring events
- Waitlist functionality
- Email notifications
- Mobile app version
- Payment integration

### 9. Development Process
1. Local development with testing on localhost
2. Testing with Vercel in preview link
3. Promotion to production after approval

### 10. Documentation Requirements
- Comprehensive documentation for all features
- Clear setup instructions
- API documentation
- Database schema documentation
- Component documentation
- Testing documentation 