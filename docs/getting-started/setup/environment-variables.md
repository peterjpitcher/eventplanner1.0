# Environment Variables

This document describes the environment variables used in the Event Management System and how to configure them for different environments.

## Overview

The Event Management System requires several environment variables for configuration, including Supabase credentials, Twilio API keys, and application settings. These variables are used for:

- Database connection (Supabase)
- SMS notifications (Twilio)
- Application behavior
- Deployment settings

## Required Environment Variables

### Supabase Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | The URL of your Supabase project | `https://abcdefghijklmnopqrst.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | The anonymous/public API key for Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Twilio Configuration (for SMS functionality)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_TWILIO_ACCOUNT_SID` | Your Twilio account SID | `ACae3fe6d3cde22dabb4d338e23df90e72` |
| `REACT_APP_TWILIO_AUTH_TOKEN` | Your Twilio auth token | `101694220d4e32c235974f1bb2681b20` |
| `REACT_APP_TWILIO_PHONE_NUMBER` | Your Twilio phone number | `+447700106752` |

### Application Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | The application environment | `development`, `production`, `test` |
| `GENERATE_SOURCEMAP` | Whether to generate source maps | `true`, `false` |
| `NODE_OPTIONS` | Node.js options | `--max-old-space-size=4096` |

## Environment Files

The project uses several environment files for different contexts:

### `.env.example`

Template file for developers to create their own `.env.local` file. Never commit actual credentials to this file.

### `.env.local`

Local development environment variables. This file is git-ignored and should contain your development credentials.

### `.env.production`

Production environment variables. Used during the production build process.

### `.env.vercel`

Environment variables specifically for Vercel deployment.

## Setting Up Environment Variables

### For Local Development

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_TWILIO_ACCOUNT_SID=your-twilio-account-sid
   REACT_APP_TWILIO_AUTH_TOKEN=your-twilio-auth-token
   REACT_APP_TWILIO_PHONE_NUMBER=your-twilio-phone-number
   ```

### For Production Deployment (Vercel)

1. In the Vercel dashboard, navigate to your project settings
2. Go to "Environment Variables"
3. Add each required environment variable
4. Ensure they are enabled for Production environment
5. Redeploy your application for changes to take effect

## Security Considerations

- Never commit sensitive environment variables to source control
- Use Vercel's encrypted environment variables for production
- Rotate keys regularly, especially after team member departures
- Consider using a secret management service for team environments

## Troubleshooting

### Common Issues

#### Environment variables not being loaded

**Problem**: Application can't access environment variables.
**Solution**: Make sure:
- Variables are prefixed with `REACT_APP_` for Create React App to recognize them
- You've restarted the development server after changing variables
- Variables are correctly set in Vercel for production

#### Supabase connection issues

**Problem**: "Supabase URL or Anon Key is missing" error.
**Solution**: 
- Verify that environment variables are correctly set
- Check for typos in variable names
- Verify your Supabase project is active

#### Twilio SMS not working

**Problem**: SMS messages aren't being sent.
**Solution**:
- Verify Twilio credentials are correct
- Check phone number format (should be in E.164 format for Twilio)
- Verify Twilio account has sufficient credits

## Example .env.local File

```
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Twilio Configuration
REACT_APP_TWILIO_ACCOUNT_SID=ACae3fe6d3cde22dabb4d338e...
REACT_APP_TWILIO_AUTH_TOKEN=101694220d4e32c235974f1bb...
REACT_APP_TWILIO_PHONE_NUMBER=+447700106752

# Application Settings
NODE_ENV=development
```

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Twilio Documentation](https://www.twilio.com/docs)
- [Create React App - Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) 