# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-03-24

### Added
- UK phone number formatting support
- Detailed schema documentation 
- New SMS notification documentation

### Changed
- Phone numbers now stored in UK format (07XXX XXX XXX)
- Twilio integration updated to convert UK numbers to international format
- Updated validation rules for UK mobile numbers
- Improved product requirements documentation

### Fixed
- Removed Supabase Data Initializer from production builds
- Fixed phone number formatting in SMS services
- Fixed 404 error in production deployment

## [1.1.2] - 2025-03-24

### Added
- Vercel production deployment
- Fixed configuration in vercel.json
- Environment variables properly set up in Vercel

### Changed
- Updated build pipeline for production
- Improved error handling across components

### Fixed
- Fixed Twilio configuration issues
- Updated environment variable handling

## [1.1.1] - 2025-03-23

### Added
- Enhanced database schema check
- Improved Supabase connectivity checks
- Better form validation throughout the application

### Changed
- Improved form submission flow
- Consistent UI styling across all components

### Fixed
- Fixed ESLint warnings throughout the codebase
- Fixed Component consistency
- Better error handling for service failures

## [1.1.0] - 2025-03-22

### Added
- Full Supabase integration for all components
- Enhanced database schema with correct fields
- Data layer architecture with proper service separation

### Changed
- Improved service layer with graceful fallback to mock data
- Enhanced UI for better user experience

### Fixed
- Fixed missing `attendees` field in database schema
- Fixed TypeScript errors in components
- Improved error handling

## [1.0.0] - 2025-03-20

### Added
- Initial release with core functionality
- Customer management
- Event category management
- Event management
- Booking system
- Basic SMS notification
- Dashboard with overview
- Mock data system for development 