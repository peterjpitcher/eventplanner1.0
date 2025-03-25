# Event Management System v1.1 Requirements

This document outlines the detailed requirements for version 1.1 enhancements to the Event Management System.

## 1. UI Fixes

### 1.1 Event Category Edit Form
**Current Issue:** When editing an event category, metadata is shown instead of actual values.
**Requirement:** Fix the edit form to display proper values from the database.

**Acceptance Criteria:**
- Event category form displays correct name in the "Category Name" field
- Default capacity shows the actual number value
- Default start time shows the correct time
- Notes display the actual notes content
- Data is saved correctly when editing

### 1.2 Event Creation Category Default
**Current Issue:** Category selector auto-selects an option rather than defaulting to a placeholder.
**Requirement:** Update the form to default to "Select a category" option.

**Acceptance Criteria:**
- "Select a category" is the default selection when creating a new event
- No default values are applied until a specific category is selected
- When a category is selected, default values are populated
- Form validation still requires an actual category to be selected

### 1.3 Zero Seats for Reminder-Only Bookings
**Requirement:** Allow setting seats to 0 for reminder-only bookings.

**Acceptance Criteria:**
- Booking form accepts 0 as a valid seat count
- Validation allows 0 seats
- Bookings with 0 seats are visually marked as "Reminder Only"
- Database correctly stores and retrieves bookings with 0 seats

## 2. Format Standardization

### 2.1 Date Format
**Requirement:** Display all dates in the format "Month d, yyyy" (e.g., "March 28, 2024").

**Acceptance Criteria:**
- All dates throughout the application use this format
- The format is applied consistently across all components
- Uses British English month names

### 2.2 Time Format
**Requirement:** Display all times in am/pm format (e.g., "9pm", "6:30pm").

**Acceptance Criteria:**
- All times throughout the application use am/pm format
- Hours without minutes show only the hour (e.g., "9pm" not "9:00pm")
- Hours with minutes show both (e.g., "6:30pm")
- Format is applied consistently across all components

## 3. List Display and Sorting

### 3.1 Show Seats in Booking List
**Requirement:** Display seat count in the bookings list with visual indicator for reminder-only bookings.

**Acceptance Criteria:**
- Booking list shows seat count for each booking
- Bookings with 0 seats are clearly marked as "Reminder Only"
- Information is presented in a visually clear manner

### 3.2 Group Bookings by Event
**Requirement:** Group bookings by event in an accordion-style UI.

**Acceptance Criteria:**
- Bookings are visually grouped by event
- Each event section can be expanded/collapsed
- Event name, date, and time are shown in the event header
- Collapsed state shows summary information (number of bookings)
- Expanded state shows all bookings for that event

### 3.3 Sorting Requirements
**Requirements:**
- Bookings sorted alphabetically by customer name within each event group
- Events sorted by date (earliest first)
- Customers sorted alphabetically by name

**Acceptance Criteria:**
- All lists follow the specified sorting order
- Sorting is applied automatically without user interaction
- Sorting remains consistent across page reloads

### 3.4 Event Capacity Display
**Requirement:** Show booking capacity for each event.

**Acceptance Criteria:**
- Events list displays current booking count out of total capacity (e.g., "5/25 booked")
- Information is updated in real-time when bookings are added/removed
- Display is visually clear and easy to understand

### 3.5 Past Events Toggle
**Requirement:** Add toggle to switch between upcoming and past events.

**Acceptance Criteria:**
- Default view shows only future events
- Toggle control allows viewing past events
- State is clearly indicated to users
- Switching is immediate and maintains consistent sorting

## 4. Notes Display

**Requirement:** Display notes clearly for customers, events, and bookings.

**Acceptance Criteria:**
- Notes are prominently displayed in all detail views
- Notes are visible in list views where appropriate
- Empty notes fields are handled gracefully (e.g., "No notes")
- Notes display has consistent styling across the application

## 5. SMS Templates and Variables

### 5.1 SMS Templates
**Requirement:** Update the following SMS templates:
1. Booking confirmation
2. Reminder confirmation
3. Booking cancellation
4. 7-day reminder
5. 24-hour reminder

**Acceptance Criteria:**
- Templates maintain professional and friendly tone
- All templates use correct variable substitution
- Templates have appropriate length for SMS messages
- Templates are editable through the admin interface

### 5.2 Available Variables
**Requirement:** Document and display available variables for SMS templates.

**Acceptance Criteria:**
- Documentation lists all available variables
- Variables are shown in the template editor UI
- Clear explanation of what each variable represents
- Examples of variable usage are provided

## 6. Automated Reminders

### 6.1 Remove Manual Component
**Requirement:** Remove the "send event reminders" component.

**Acceptance Criteria:**
- Component is completely removed from the UI
- All associated navigation and references are removed
- No broken links or references remain

### 6.2 Implement Automated Cron Jobs
**Requirement:** Implement automated GitHub Actions cron job to send reminders.

**Acceptance Criteria:**
- GitHub Actions workflow runs daily at 9am
- Reminders are sent for events 7 days away
- Reminders are sent for events 24 hours away
- No reminders are sent unless criteria are met
- SMS sending process is secure and authenticated
- All SMS activity is logged for audit purposes

### 6.3 API Endpoint for Cron Job
**Requirement:** Create a secure API endpoint to process reminders.

**Acceptance Criteria:**
- Endpoint is properly secured with authentication
- Endpoint performs the correct database queries
- Only authorized calls can trigger reminders
- Endpoint returns appropriate success/error responses
- Error handling is robust and logs issues 