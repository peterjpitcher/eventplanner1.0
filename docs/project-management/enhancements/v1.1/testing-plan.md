# Event Management System v1.1 Testing Plan

This document outlines the comprehensive testing strategy for version 1.1 enhancements to the Event Management System.

## 1. Unit Testing

### 1.1 Utility Functions
- Test date formatting function with various date inputs
- Test time formatting function with various time inputs
- Test edge cases (null values, invalid dates)
- Test boundary cases (midnight, noon, etc.)

### 1.2 Form Validation
- Test booking validation with 0 seats
- Test event category form validation
- Test event form validation with default and non-default options

### 1.3 Data Processing Functions
- Test sorting functions for customers, events, and bookings
- Test event capacity calculation
- Test past/future event filtering

## 2. Component Testing

### 2.1 Event Category Edit Form
- Test form loading with actual data
- Test form submission with various data combinations
- Test validation errors
- Test cancellation behavior

### 2.2 Event Creation Form
- Test default category selection
- Test category selection and default value population
- Test form with missing required fields
- Test date and time selection

### 2.3 Booking Form
- Test creating booking with standard seat count
- Test creating booking with 0 seats (reminder only)
- Test validation messages
- Test booking limits based on capacity

### 2.4 Booking List Component
- Test grouping by event
- Test sorting within groups
- Test expand/collapse functionality
- Test "Reminder Only" indicator display

### 2.5 Event List Component
- Test sorting by date
- Test capacity display
- Test past/future toggle
- Test display of event details

### 2.6 SMS Template Components
- Test template editor with variables
- Test variable substitution preview
- Test template saving

## 3. Integration Testing

### 3.1 Data Flow
- Test end-to-end flow from event creation to booking to SMS notification
- Test customer creation and linking to bookings
- Test booking modification and impact on event capacity

### 3.2 SMS Integration
- Test SMS sending with template variables
- Test SMS logging
- Test error handling for SMS failures

### 3.3 Automated Reminders
- Test reminder processing logic
- Test 7-day reminder criteria
- Test 24-hour reminder criteria

## 4. API Endpoint Testing

### 4.1 Reminder Processing Endpoint
- Test authentication requirements
- Test successful reminder processing
- Test handling of no qualifying reminders
- Test error scenarios and responses
- Test concurrent requests

### 4.2 GitHub Actions Integration
- Test GitHub Actions workflow trigger
- Test scheduled execution
- Test API call from GitHub Actions
- Test authentication from GitHub Actions

## 5. User Acceptance Testing (UAT)

### 5.1 Event Management Workflows
- Test creating event categories with proper display
- Test editing event categories
- Test creating events with various categories
- Test viewing future and past events

### 5.2 Booking Management Workflows
- Test creating standard bookings
- Test creating reminder-only bookings
- Test viewing bookings grouped by event
- Test booking display with seat information
- Test notes display

### 5.3 SMS Testing
- Test SMS template editing
- Verify SMS delivery for various template types
- Test variable substitution in delivered messages

### 5.4 Automated Reminder Testing
- Test automatic delivery of 7-day reminders
- Test automatic delivery of 24-hour reminders
- Verify no reminders sent outside criteria

## 6. Cross-Browser Testing

Test all UI enhancements across:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 7. Test Cases

### 7.1 Event Category Edit Form Fix
1. **TC-101**: Navigate to event categories and edit an existing category
   - **Expected**: Form shows actual values for all fields
   - **Steps**:
     1. Go to Event Categories list
     2. Click "Edit" on an existing category
     3. Verify displayed values match actual category data
     4. Edit fields and save
     5. Verify changes persist

### 7.2 Event Creation Default Category
1. **TC-201**: Create a new event with default category selection
   - **Expected**: Form initially shows "Select a category" with no defaults
   - **Steps**:
     1. Go to Create Event page
     2. Verify "Select a category" is the default option
     3. Verify no default values are populated
     4. Select a specific category
     5. Verify default values are populated
     6. Create event successfully

### 7.3 Zero Seats Booking
1. **TC-301**: Create a booking with 0 seats
   - **Expected**: System accepts booking as "Reminder Only"
   - **Steps**:
     1. Go to Create Booking page
     2. Select customer and event
     3. Set seats to 0
     4. Add notes and save
     5. Verify booking appears with "Reminder Only" indicator

### 7.4 Date and Time Formatting
1. **TC-401**: Verify date format across application
   - **Expected**: All dates display as "Month d, yyyy"
   - **Steps**:
     1. Check events list
     2. Check booking details
     3. Check event details
     4. Verify consistent formatting

2. **TC-402**: Verify time format across application
   - **Expected**: All times display as "9pm" or "6:30pm"
   - **Steps**:
     1. Check events with various times
     2. Verify hours without minutes show without ":00"
     3. Verify hours with minutes show both
     4. Verify consistent am/pm formatting

### 7.5 Bookings Grouped by Event
1. **TC-501**: Verify bookings display grouped by event
   - **Expected**: Accordion UI groups bookings by event
   - **Steps**:
     1. Create multiple bookings for multiple events
     2. Go to Bookings page
     3. Verify bookings are grouped by event
     4. Verify expand/collapse functionality
     5. Verify sorting of customers within each group

### 7.6 Automated Reminders
1. **TC-601**: Test automated 7-day reminders
   - **Expected**: System identifies and processes correct reminders
   - **Steps**:
     1. Create events 7 days in the future
     2. Create bookings for these events
     3. Trigger or wait for cron job
     4. Verify reminders are sent
     5. Check SMS logs

2. **TC-602**: Test automated 24-hour reminders
   - **Expected**: System identifies and processes correct reminders
   - **Steps**:
     1. Create events 24 hours in the future
     2. Create bookings for these events
     3. Trigger or wait for cron job
     4. Verify reminders are sent
     5. Check SMS logs

## 8. Regression Testing

### 8.1 Core Functionality
- Test that existing functionality not changed by enhancements still works correctly:
  - Customer creation and management
  - Event creation and management
  - Basic booking processes
  - SMS sending for non-reminder situations

### 8.2 Visual Regression
- Check that UI changes do not negatively impact existing layouts
- Verify responsive behavior is maintained
- Ensure accessibility is maintained

## 9. Performance Testing

### 9.1 Large Data Sets
- Test booking list with large number of bookings across many events
- Test sorting and grouping performance with large data sets
- Test event capacity calculation with many bookings

### 9.2 API Performance
- Test reminder processing endpoint with various load scenarios
- Measure response times and resource usage

## 10. Security Testing

### 10.1 API Authentication
- Verify reminder API endpoint authentication works correctly
- Test with invalid credentials
- Test with expired tokens
- Test with insufficient permissions

### 10.2 GitHub Actions Security
- Verify secrets are properly secured
- Verify workflow runs with correct permissions
- Test unauthorized access attempts 