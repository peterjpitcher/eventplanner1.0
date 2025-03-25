# Database Documentation
This directory contains documentation related to the database schema, relationships, and management.

## Contents
- [Schema](#schema)
- [Relationships](#relationships)
- [Phone Number Format](#phone-number-format)
- [Migrations](./migrations/)

## Purpose
This section provides comprehensive documentation of the database structure, including schema details, relationships, and management procedures.

## Schema

### customers
- `id` (UUID) - Primary key, auto-generated with `gen_random_uuid()`
- `first_name` (TEXT) - The customer's first name
- `last_name` (TEXT) - The customer's last name
- `mobile_number` (TEXT) - Customer's mobile phone number in UK format (07XXX XXX XXX)
- `notes` (TEXT) - Optional notes about the customer
- `created_at` (TIMESTAMP WITH TIME ZONE) - When the record was created
- `updated_at` (TIMESTAMP WITH TIME ZONE) - When the record was last updated

### event_categories
- `id` (UUID) - Primary key, auto-generated with `gen_random_uuid()`
- `name` (TEXT) - The category name
- `default_capacity` (INTEGER) - Default capacity for events in this category
- `default_start_time` (TIME) - Default start time for events in this category
- `notes` (TEXT) - Optional notes about the category
- `created_at` (TIMESTAMP WITH TIME ZONE) - When the record was created
- `updated_at` (TIMESTAMP WITH TIME ZONE) - When the record was last updated

### events
- `id` (UUID) - Primary key, auto-generated with `gen_random_uuid()`
- `name` (TEXT) - The event name
- `category_id` (UUID) - Foreign key reference to event_categories.id
- `capacity` (INTEGER) - Maximum number of attendees
- `start_time` (TIMESTAMP WITH TIME ZONE) - When the event starts
- `notes` (TEXT) - Optional notes about the event
- `created_at` (TIMESTAMP WITH TIME ZONE) - When the record was created
- `updated_at` (TIMESTAMP WITH TIME ZONE) - When the record was last updated

### bookings
- `id` (UUID) - Primary key, auto-generated with `gen_random_uuid()`
- `customer_id` (UUID) - Foreign key reference to customers.id
- `event_id` (UUID) - Foreign key reference to events.id
- `attendees` (INTEGER) - Number of attendees for this booking
- `notes` (TEXT) - Optional notes about the booking
- `created_at` (TIMESTAMP WITH TIME ZONE) - When the record was created
- `updated_at` (TIMESTAMP WITH TIME ZONE) - When the record was last updated

### sms_logs
- `id` (UUID) - Primary key, auto-generated with `gen_random_uuid()`
- `phone_number` (TEXT) - The recipient's phone number
- `message_body` (TEXT) - The content of the SMS message
- `success` (BOOLEAN) - Whether the message was sent successfully
- `error_message` (TEXT) - Error details if the message failed
- `created_at` (TIMESTAMP WITH TIME ZONE) - When the record was created

## Relationships
- `bookings.customer_id` → `customers.id` (Many-to-One)
- `bookings.event_id` → `events.id` (Many-to-One)
- `events.category_id` → `event_categories.id` (Many-to-One)

## Phone Number Format
The application uses UK mobile phone numbers, which have specific format requirements:

- **Database Storage Format:** `07XXX XXX XXX` (local UK format)
- **SMS Sending Format:** `+44XXXXXXXXXX` (international E.164 format required by Twilio)

When a phone number is used for SMS sending, the application automatically converts from the local storage format to the international format using the following rules:

1. If the number already starts with `+`, it's assumed to be in international format and is used as-is
2. If the number starts with `07` (UK mobile prefix), it's converted to international format by replacing the `0` with `+44`

### Validation Rules
- Valid UK mobile numbers must start with `07` and contain 11 digits total
- The regular expression `/^(07\d{9}|\+447\d{9})$/` is used for validation
- Users are prompted to enter numbers in the format `07XXX XXX XXX` 