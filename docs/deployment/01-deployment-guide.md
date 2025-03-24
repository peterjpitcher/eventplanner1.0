# Deployment Guide for Event Planner

This guide provides detailed instructions for deploying the Event Planner application to Vercel, setting up required environment variables, and troubleshooting common deployment issues.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deploying to Vercel](#deploying-to-vercel)
3. [Environment Variables](#environment-variables)
4. [Post-Deployment Steps](#post-deployment-steps)
5. [Troubleshooting](#troubleshooting)
6. [Continuous Deployment](#continuous-deployment)

## Prerequisites

Before deploying, ensure you have:

- A GitHub account with the project repository
- A Vercel account (free tier is sufficient)
- A Supabase account with a project set up
- (Optional) A Twilio account for SMS functionality

## Deploying to Vercel

### First-Time Deployment

1. **Sign up for Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up or log in
   - Connect your GitHub account when prompted

2. **Import your repository**:
   - From the Vercel dashboard, click "Add New..." → "Project"
   - Find and select your Event Planner repository
   - Vercel will automatically detect that it's a React application

3. **Configure project settings**:
   - Project Name: Choose a name or use the default
   - Framework Preset: Make sure "Create React App" is selected
   - Root Directory: Leave as `.` (or set to `event-planner` if your repository has a different structure)
   - Build Command: Use the default (`npm run build`)
   - Output Directory: Use the default (`build`)

4. **Set environment variables**:
   - Expand the "Environment Variables" section
   - Add the following variables:
     - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
     - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - (Optional) `REACT_APP_TWILIO_ACCOUNT_SID`: Your Twilio account SID
     - (Optional) `REACT_APP_TWILIO_AUTH_TOKEN`: Your Twilio auth token
     - (Optional) `REACT_APP_TWILIO_PHONE_NUMBER`: Your Twilio phone number

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once completed, you'll receive a URL where your application is hosted

### Updating an Existing Deployment

When you push changes to your GitHub repository, Vercel will automatically deploy the updates if you've set up continuous deployment (enabled by default).

To manually trigger a new deployment:

1. Go to your project in the Vercel dashboard
2. Click on the "Deployments" tab
3. Click "Redeploy" on your latest deployment

## Environment Variables

### Required Variables

- `REACT_APP_SUPABASE_URL`: The URL of your Supabase project
  - Format: `https://your-project-id.supabase.co`
  - Location in Supabase: Project Settings → API → Project URL

- `REACT_APP_SUPABASE_ANON_KEY`: The anonymous/public API key for Supabase
  - Format: A long alphanumeric string
  - Location in Supabase: Project Settings → API → `anon` `public` key

### Optional Variables (for SMS functionality)

- `REACT_APP_TWILIO_ACCOUNT_SID`: Your Twilio account SID
- `REACT_APP_TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `REACT_APP_TWILIO_PHONE_NUMBER`: Your Twilio phone number

### Updating Environment Variables

If you need to update environment variables after deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" → "Environment Variables"
3. Add, edit, or delete variables as needed
4. **Important**: After updating environment variables, you must redeploy your application for the changes to take effect

## Post-Deployment Steps

After successful deployment, perform these checks:

1. **Verify application functionality**:
   - Navigate to your deployed URL
   - Test all major features: customer management, event creation, booking system
   - Verify that data is being stored and retrieved correctly

2. **Check Supabase connection**:
   - Confirm that your application is connecting to Supabase
   - Create a test record and verify it appears in your Supabase database

3. **Test SMS functionality** (if configured):
   - Create a test booking with SMS notification
   - Verify that the SMS is sent (check Twilio logs)

## Troubleshooting

### Common Issues and Solutions

#### 1. "Supabase URL or Anon Key is missing" Error

**Cause**: The application can't find the Supabase credentials in environment variables.

**Solutions**:
- Verify that environment variables are correctly set in Vercel
- Check for typos in variable names (they must match exactly: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`)
- Redeploy the application after updating environment variables
- Check that your Supabase project is active and the API keys are valid

#### 2. Deployment Fails During Build

**Cause**: Usually due to code errors or dependency issues.

**Solutions**:
- Check the build logs in Vercel for specific error messages
- Ensure the application builds successfully locally with `npm run build`
- Update dependencies to compatible versions
- Fix any TypeScript errors in your code

#### 3. Application Loads But Shows Blank Screen

**Cause**: JavaScript runtime errors after loading.

**Solutions**:
- Open browser developer tools (F12) and check the console for errors
- Verify that all required environment variables are set
- Check for React rendering issues or route configuration problems

#### 4. Styling Issues

**Cause**: CSS or style-related problems.

**Solution**:
- The application uses React inline styles. Check the component files where styling is defined
- Update CSS properties in the affected components

## Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository:

- **Preview Deployments**: Every pull request gets a unique preview URL
- **Production Deployments**: Merges to the main branch trigger updates to your production deployment

### Custom Domains

To use a custom domain:

1. Go to your project in Vercel
2. Click on "Settings" → "Domains"
3. Add your domain and follow the verification steps

### Branch Deployments

You can create separate environments for different branches:

1. Go to your project settings in Vercel
2. Under "Git", configure branch deployments
3. For example, set `main` to production and `staging` to a preview environment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Twilio API Documentation](https://www.twilio.com/docs) 