# Deployment Guide for Realtor Jigar Platform

This guide provides instructions for deploying the Realtor Jigar Platform using either Vercel or Netlify.

## Prerequisites
- A GitHub account with access to the project repository
- A Supabase account with project setup completed
- Environment variables from your `.env` file

## Deploying with Vercel

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account
   - Connect your GitHub account to Vercel

2. **Import your GitHub Repository**
   - Click "Add New..." → "Project" in your Vercel dashboard
   - Select the "realtorjigar" repository from the list
   - Configure your project:
     - Framework Preset: Vite
     - Root Directory: `./` (or the directory containing your package.json)

3. **Configure Environment Variables**
   - Add all variables from your `.env` file to Vercel's environment variables section:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_OPENAI_API_KEY` (for AI Chat feature)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - If successful, you'll receive a deployment URL

5. **Custom Domain (Optional)**
   - In your project settings, go to the "Domains" section
   - Add and configure your custom domain

## Deploying with Netlify

1. **Create a Netlify Account**
   - Sign up at [netlify.com](https://netlify.com) if you don't have an account
   - Connect your GitHub account to Netlify

2. **Import your GitHub Repository**
   - Click "New site from Git" in your Netlify dashboard
   - Select GitHub and authorize Netlify
   - Select the "realtorjigar" repository

3. **Configure Build Settings**
   - Build command: `npm run build` (or as specified in your package.json)
   - Publish directory: `dist` (default for Vite projects)

4. **Configure Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from your `.env` file:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_OPENAI_API_KEY` (for AI Chat feature)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - If successful, you'll receive a deployment URL

6. **Custom Domain (Optional)**
   - In your site settings, go to "Domain settings"
   - Add and configure your custom domain

## Post-Deployment Verification

After deployment, verify that:

1. Authentication works correctly
2. Property CRUD operations function properly
3. Image uploads work
4. Filters function as expected
5. AI Chat responds correctly

## Troubleshooting Common Issues

- **API Connection Issues**: Ensure all environment variables are correctly set
- **Build Failures**: Check build logs for specific errors
- **CORS Errors**: Verify Supabase configuration allows requests from your deployment domain
- **Image Upload Problems**: Confirm storage bucket permissions in Supabase
- **AI Chat Not Working**: Verify OpenAI API key is valid and has sufficient credits

## Continuous Deployment

Both Vercel and Netlify support automatic deployments when you push changes to your GitHub repository. No additional configuration is needed for this feature.

## Database Synchronization

For production deployment, you may need to:

1. Create a new Supabase project for production
2. Migrate your tables and data from development to production
3. Update the environment variables with production Supabase credentials

## Security Considerations

1. Ensure Row-Level Security is properly configured in Supabase
2. Verify API keys are restricted to approved domains
3. Consider implementing rate limiting for public-facing endpoints

## Monitoring and Analytics

1. Set up error tracking with tools like Sentry
2. Configure analytics to track user behavior
3. Set up monitoring for server health and performance
