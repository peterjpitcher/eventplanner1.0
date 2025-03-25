# Event Management System v1.1 Implementation Plan

## Overview

This document outlines the phased implementation plan for version 1.1 of the Event Management System. These enhancements focus on improving the user experience, fixing data display issues, and automating reminder processes.

## Features & Fixes

1. Fix event category edit form data display
2. Improve event creation with proper category default
3. Allow zero seats for reminder-only bookings
4. Update SMS templates and document variables
5. Implement automated reminder cron jobs using GitHub Actions
6. Display seat counts in booking list
7. Standardize date and time formats
8. Group bookings by event
9. Sort bookings, events, and customers appropriately
10. Display capacity information for events
11. Add past events toggle
12. Improve display of notes fields

## Phased Implementation

### Phase 1: Data Display & Format Standardization

**Estimated time: 1 week**

1. **Utility Functions**
   - Create date formatting utility (Month d, yyyy format)
   - Create time formatting utility (9pm, 6:30pm format)
   - Implement centralized formatting functions

2. **UI Display Improvements**
   - Fix Event Category edit form to display actual data
   - Update Event form to default to "Select a category" option
   - Update Bookings list to show seat count
   - Add visual indicator for reminder-only bookings
   - Display notes on all customer, event, and booking views

3. **Sort and Order Implementation**
   - Implement alphabetical sorting for customers
   - Implement date-based sorting for events
   - Add functionality to view past events
   - Implement capacity display (booked/total)

### Phase 2: Booking & Interface Enhancements

**Estimated time: 1 week**

1. **Booking System Improvements**
   - Modify booking form to allow 0 seats
   - Update validation logic for bookings
   - Group bookings by event in accordion style UI
   - Sort bookings alphabetically by customer name

2. **SMS Template Updates**
   - Update booking confirmation template
   - Update reminder confirmation template  
   - Update booking cancellation template
   - Update 7-day reminder template
   - Update 24-hour reminder template
   - Document available template variables

3. **Manual Reminder Cleanup**
   - Remove "send event reminders" component
   - Update UI navigation and layout as needed

### Phase 3: Automation Implementation

**Estimated time: 1-2 weeks**

1. **API Endpoint Creation**
   - Create secure API endpoint for processing reminders
   - Implement authentication for GitHub Actions access
   - Add logging for all reminder operations

2. **GitHub Actions Setup**
   - Create workflow file for scheduled job
   - Configure daily run at 9am
   - Set up secrets for API authentication

3. **Reminder Logic**
   - Implement 7-day and 24-hour reminder checks
   - Create SMS sending service connection
   - Add error handling and retry logic

## Technical Specifications

### GitHub Actions Workflow

The GitHub Actions workflow will:
1. Run daily at 9am
2. Make authenticated API calls to a dedicated endpoint
3. The endpoint will:
   - Query for bookings with events 7 days away
   - Query for bookings with events 24 hours away  
   - Send SMS reminders using appropriate templates
   - Log all SMS activities

```yaml
# Example GitHub Actions workflow
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
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.REMINDER_PAT }}
          repository: [owner]/[repo]
          event-type: process-reminders
          client-payload: '{"source": "github-actions"}'
```

### API Endpoint

A new API endpoint will be created:
- Path: `/api/cron/process-reminders`
- Authentication: Secure token
- Operations:
  1. Find bookings for events in the next 7 days and 24 hours
  2. Process and send SMS reminders
  3. Log all activities

### Database Schema Updates

No schema changes are required for these enhancements.

## Testing Plan

### Phase 1 Testing
- Verify correct date and time formats across all pages
- Confirm event category editing displays correct data
- Verify sorting and ordering of lists
- Test capacity display accuracy

### Phase 2 Testing
- Test booking creation with 0 seats
- Verify booking groups display correctly
- Test all SMS templates with variable substitution
- Verify notes display properly on all views

### Phase 3 Testing
- Test API endpoint with various input scenarios
- Verify GitHub Actions workflow execution
- Test reminder detection logic
- Verify SMS sending through the automated process
- Test error handling and edge cases

## Rollout Plan

1. **Development**: Implement all changes on development branch
2. **Testing**: Comprehensive testing in staging environment
3. **Documentation**: Update user documentation to reflect new features
4. **Deployment**: Phased rollout to production
5. **Monitoring**: Post-deployment monitoring for any issues

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| GitHub Actions timing reliability | Add redundancy checks and self-healing mechanisms |
| SMS sending failures | Implement retry logic and failure notifications |
| Performance impact of new sorting/filtering | Optimize queries and implement pagination where needed |
| User adoption of new interface | Provide tooltips and clear visual indicators for new features |

## Future Considerations

- Addition of email notifications as alternative to SMS
- Enhanced reporting on SMS delivery status
- Waitlist functionality for fully booked events
- Recurring event scheduling 