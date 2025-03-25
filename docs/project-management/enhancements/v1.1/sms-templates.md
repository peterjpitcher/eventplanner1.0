# SMS Templates for Event Management System v1.1

This document contains the updated SMS templates and available variables for the Event Management System.

## Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{customerName}}` | Customer's full name | John Smith |
| `{{eventName}}` | Name of the event | Quiz Night |
| `{{eventDate}}` | Formatted date of the event | March 28, 2024 |
| `{{eventTime}}` | Formatted time of the event | 7pm |
| `{{venueDetails}}` | Location details for the event | The Red Lion Pub |
| `{{seatsBooked}}` | Number of seats booked | 3 |

## SMS Templates

### 1. Booking Confirmation

**Template:**
```
Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} at {{eventTime}} has been confirmed. We've reserved {{seatsBooked}} seat(s) for you. We look forward to seeing you at {{venueDetails}}!
```

**Example:**
```
Hi John Smith, your booking for Quiz Night on March 28, 2024 at 7pm has been confirmed. We've reserved 3 seat(s) for you. We look forward to seeing you at The Red Lion Pub!
```

### 2. Reminder Confirmation

**Template:**
```
Hi {{customerName}}, we've set a reminder for you about {{eventName}} on {{eventDate}} at {{eventTime}}. We look forward to seeing you at {{venueDetails}}!
```

**Example:**
```
Hi John Smith, we've set a reminder for you about Quiz Night on March 28, 2024 at 7pm. We look forward to seeing you at The Red Lion Pub!
```

### 3. Booking Cancellation

**Template:**
```
Hi {{customerName}}, your booking for {{eventName}} on {{eventDate}} at {{eventTime}} has been cancelled as requested. If this was a mistake, please contact us.
```

**Example:**
```
Hi John Smith, your booking for Quiz Night on March 28, 2024 at 7pm has been cancelled as requested. If this was a mistake, please contact us.
```

### 4. 7-Day Reminder

**Template:**
```
Hi {{customerName}}, just a friendly reminder that you're booked for {{eventName}} next week on {{eventDate}} at {{eventTime}}. We look forward to seeing you at {{venueDetails}}!
```

**Example:**
```
Hi John Smith, just a friendly reminder that you're booked for Quiz Night next week on March 28, 2024 at 7pm. We look forward to seeing you at The Red Lion Pub!
```

### 5. 24-Hour Reminder

**Template:**
```
Hi {{customerName}}, just a friendly reminder that you're booked for {{eventName}} tomorrow at {{eventTime}}. We look forward to seeing you at {{venueDetails}}!
```

**Example:**
```
Hi John Smith, just a friendly reminder that you're booked for Quiz Night tomorrow at 7pm. We look forward to seeing you at The Red Lion Pub!
```

## Implementation Notes

1. These templates should be stored in the database to allow for future customization by administrators
2. Variables should be dynamically replaced at the time of sending
3. Character count should be monitored to prevent SMS splitting (keep under 160 characters when possible)
4. All templates should maintain a professional yet friendly tone
5. Templates should provide essential information without unnecessary details 