# Product Requirements Document (PRD)
## Event Management System for Pub Events

### 1. Overview
The Event Management System is a web application designed to help pub owners manage their events, customer registrations, and bookings efficiently. The system will provide a clean, minimalist interface for managing all aspects of event planning and customer engagement.

### 2. Technical Stack
- **Frontend**: React with TypeScript
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **SMS Service**: Twilio
- **Deployment**: Vercel
- **Version Control**: GitHub
- **State Management**: React Context and Hooks
- **Development Mode**: Mock Data System with Service Layer

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
  - Real-time data fetching from Supabase
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
  - Remaining capacity tracking
- **Event List View**
  - Calendar view of upcoming events
  - Quick access to event details and bookings
  - Real-time capacity tracking with visual indicators
  - Color-coded capacity status (green: available, yellow: filling up, red: near capacity)

#### 3.3 Booking Management
- **Booking Creation**
  - Link customer to event
  - Number of attendees
  - Booking notes
  - Automatic capacity check against remaining capacity
- **Booking List View**
  - Filter by event
  - Filter by date
  - Quick access to customer details
  - Display of attendee count per booking
- **Capacity Management**
  - Track total attendees per event
  - Prevent overbooking with real-time capacity checks
  - Display remaining capacity in real-time

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
- **Bulk SMS**
  - Send messages to multiple customers
  - Track delivery status
  - Handle failures gracefully

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
   - remaining_capacity (computed)

4. **bookings**
   - id (uuid)
   - customer_id (uuid, foreign key)
   - event_id (uuid, foreign key)
   - attendees (integer)
   - notes (text)
   - created_at (timestamp)

### 6. Service Layer Architecture
- **Service Pattern**
  - Consistent API for all data operations
  - Transparent fallback to mock data
  - Real-time data synchronization with Supabase
  - Error handling and retry logic
- **Mock Data System**
  - Development mode with realistic mock data
  - Maintains relationships between entities
  - Automatic generation of test data
  - Seamless transition between mock and real data

### 7. Development Tools
- **DatabaseInitializer Component**
  - One-click database setup
  - Schema verification
  - Test data population
  - Connection status monitoring
- **Debug Components**
  - Real-time connection status
  - Data synchronization monitoring
  - Error logging and reporting

### 8. Security Requirements
- Supabase authentication required for all access
- Secure storage of Twilio credentials
- Input validation and sanitization
- Protection against SQL injection

### 9. Performance Requirements
- Page load time < 2 seconds
- Booking creation < 1 second
- SMS delivery confirmation tracking
- Efficient database queries

### 10. Future Considerations
- Potential for recurring events
- Waitlist functionality
- Email notifications
- Mobile app version
- Payment integration

### 11. Development Process
1. Local development with testing on localhost
2. Testing with Vercel in preview link
3. Promotion to production after approval

### 12. Documentation Requirements
- Comprehensive documentation for all features
- Clear setup instructions
- API documentation
- Database schema documentation
- Component documentation
- Testing documentation
- **Documentation Organization**
  - Version-specific documentation in `/docs/enhancements/v{version}/`
  - Standardized file naming with numbered prefixes (e.g., 00-index.md, 01-feature.md)
  - Clear separation of core and technical documentation
  - Comprehensive index files for each version
  - Cross-referencing between related documents
- **Documentation Standards**
  - Consistent Markdown formatting
  - Code examples with syntax highlighting
  - Clear section hierarchy
  - Implementation status tracking
  - Technical decision records (TDRs)
  - Regular updates with each feature enhancement 