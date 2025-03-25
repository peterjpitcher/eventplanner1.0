# FAQ & Troubleshooting

This document provides answers to frequently asked questions and solutions to common issues encountered when working with the Event Management System.

## Table of Contents
- [Frequently Asked Questions](#frequently-asked-questions)
  - [General](#general)
  - [Setup & Installation](#setup--installation)
  - [Development](#development)
  - [Supabase](#supabase)
  - [Twilio Integration](#twilio-integration)
- [Troubleshooting](#troubleshooting)
  - [Build Issues](#build-issues)
  - [Runtime Errors](#runtime-errors)
  - [Deployment Issues](#deployment-issues)
  - [SMS Notification Issues](#sms-notification-issues)
  - [Database Issues](#database-issues)

## Frequently Asked Questions

### General

#### What is the Event Management System?
The Event Management System is a web application designed to help pub staff manage events, customer registrations, and bookings efficiently. It includes features for customer management, event creation, booking management, and SMS notifications.

#### What technologies does the system use?
The system is built using React with TypeScript for the frontend, Supabase for backend storage and authentication, and Twilio for SMS notifications. It is deployed on Vercel.

### Setup & Installation

#### How do I set up a development environment?
Follow the instructions in the [Getting Started Guide](../getting-started/01-getting-started-guide.md) to set up your development environment.

#### What environment variables do I need?
You need to set up environment variables for Supabase and Twilio integration. See the [Setup Guide](../setup/02-setup-guide.md) for details on required environment variables.

#### How do I connect to Supabase?
1. Create a Supabase account
2. Create a new project
3. Copy the project URL and anon key
4. Add these to your .env.local file as REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY

### Development

#### How do I create a new component?
Follow the component standards in the [UI Component Guidelines](../components/01-ui-component-guidelines.md). Look at existing components for patterns and ensure you follow the project's naming conventions.

#### How do I run tests?
Use `npm test` to run tests. See the [Testing Guidelines](../testing/02-testing-guidelines.md) for more information on writing and running tests.

#### How do I debug issues?
Refer to the [Debugging Tools](../development/01-debugging-tools.md) documentation for information on available debugging tools and techniques.

### Supabase

#### How do I create a new database table?
Create new tables through the Supabase dashboard or using SQL. Make sure to update the database schema documentation and create appropriate TypeScript types in the application.

#### How do I query data from Supabase?
Use the Supabase JavaScript client library. For example:
```typescript
const { data, error } = await supabase
  .from('customers')
  .select('*')
  .order('last_name', { ascending: true });
```

#### Are there rate limits for Supabase queries?
Yes, Supabase has rate limits that vary by plan. Check the [Supabase documentation](https://supabase.io/docs) for current limits.

### Twilio Integration

#### How do I test SMS functionality without sending real messages?
The system has a simulation mode when Twilio credentials aren't configured. This logs messages but doesn't send them. You can also use Twilio's test credentials for development.

#### Why are my SMS messages not being sent?
Check that your Twilio credentials are correctly configured. Verify the phone number format is correct (UK format: 07XXX XXX XXX). Check the SMS logs in the Supabase database for error messages.

#### How are UK phone numbers formatted for Twilio?
UK phone numbers are automatically converted from local format (07XXX XXX XXX) to international format (+44XXXXXXXXX) before sending to Twilio.

## Troubleshooting

### Build Issues

#### Error: Module not found: Can't resolve 'module_name'
**Problem**: A required module is missing.
**Solution**: Run `npm install` to ensure all dependencies are installed.

#### TypeScript errors during build
**Problem**: Type errors are preventing the build from completing.
**Solution**: Fix the type errors in your code. Check for mismatches between interface definitions and implementations.

#### Case sensitivity issues with file imports
**Problem**: File imports may work locally but fail during build due to case sensitivity differences.
**Solution**: Ensure all import statements use the exact file name casing as the actual files.

### Runtime Errors

#### "Error: API rate limit exceeded"
**Problem**: You've exceeded Supabase's rate limits.
**Solution**: Implement caching, reduce unnecessary queries, or upgrade your Supabase plan.

#### "TypeError: Cannot read property 'X' of undefined"
**Problem**: Attempting to access a property of an undefined object.
**Solution**: Add null/undefined checks before accessing properties. Use optional chaining (`?.`) for safer property access.

### Deployment Issues

#### Deployment fails with environment variable errors
**Problem**: Missing or incorrectly configured environment variables.
**Solution**: Check Vercel settings to ensure all required environment variables are set. See [Deployment Guide](../deployment/01-deployment-guide.md).

#### Application deploys but shows a blank screen
**Problem**: JavaScript runtime error after loading.
**Solution**: Check browser console for errors. Ensure all required environment variables are set and configuration is correct.

### SMS Notification Issues

#### SMS messages aren't being sent
**Problem**: The Twilio integration isn't working correctly.
**Solution**: Verify Twilio credentials are correct. Check network requests to the SMS API are succeeding. Examine logs for error messages.

#### Phone number formatting errors
**Problem**: Phone numbers aren't being accepted by Twilio.
**Solution**: Ensure phone numbers are in the expected UK format and are being correctly converted to international format.

### Database Issues

#### "Foreign key constraint" errors
**Problem**: Attempting to delete a record that has related records.
**Solution**: Delete related records first or implement cascading deletes in your database schema.

#### Performance issues with database queries
**Problem**: Slow database responses.
**Solution**: Optimize queries, add indexes to frequently queried columns, or implement caching for commonly accessed data.

---

If you encounter an issue not covered in this guide, please contact the development team or create an issue in the project repository. 