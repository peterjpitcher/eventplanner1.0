# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-03-24

### Added
- Full integration with Supabase for all components
- Fixed database schema to include attendees field in bookings table
- Enhanced error handling throughout the application

### Changed
- Modified Dashboard component to use real data from services
- Updated CustomerList component to use real customer data
- Updated BookingList component to use real booking data
- Updated SMSNotifications component to use real customer and event data
- Replaced hardcoded mock data with service calls throughout the application

### Fixed
- Fixed TypeScript errors related to spread operator in Dashboard.tsx
- Fixed missing sendBulkSMS method in SMSNotifications.tsx
- Fixed issue with customers not having email field
- Fixed database schema discrepancies
- Ensured all bookings have the attendees field populated

## [1.0.0] - 2025-03-20

### Added
- Initial release with mock data functionality
- Customer management system
- Event management system
- Booking system with capacity control
- Event categories management
- SMS notification system
- Dashboard with key metrics
- Debug tools for database initialization 