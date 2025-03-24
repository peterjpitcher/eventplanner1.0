# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2025-03-24

### Added
- Enhanced DatabaseInitializer with detailed permission checking and better error reporting
- Added comprehensive UI consistency across all components

### Changed
- Improved form submission flow for better user experience
- Updated EventCategoryForm to use the eventCategoryService instead of mock data
- Modified redirect behavior after form submissions to return to list pages

### Fixed
- Fixed navigation issues after creating new customers, events, and bookings
- Fixed inconsistent UI in CustomerDetails component
- Added proper ESLint disable comments to suppress warnings while maintaining code functionality

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