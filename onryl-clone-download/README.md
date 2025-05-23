# Onryl Platform - Entrance Clone

This is a clone of the Entrance platform UI and functionality with Onryl branding.

## Project Structure

- `src/app` - Contains all page components organized by route
- `src/components` - Reusable UI components
- `src/lib` - Utility functions and API helpers
- `public` - Static assets

## Key Features

- Dashboard with message analytics
- Messages page with SMS functionality
- Campaigns management
- Claims handling
- Contacts management
- Workspace settings

## Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. Create a GitHub repository and push this code to it
2. Go to [Vercel.com](https://vercel.com/)
3. Connect your GitHub account
4. Import your repository
5. Vercel will automatically detect Next.js and deploy the app
6. Add any environment variables as needed

### Option 2: Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com/)
2. Create a new site from Git
3. Connect your GitHub repository
4. Use the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables as needed

### Option 3: Run Locally

```bash
# Install dependencies
npm install
# or
yarn
# or
bun install

# Start development server
npm run dev
# or
yarn dev
# or
bun run dev
```

Visit http://localhost:3000 to see the app.

## Environment Variables

Create an `.env.local` file with the following variables:
```
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token

# Base URL for webhooks
NEXT_PUBLIC_BASE_URL=your_base_url
```

## Troubleshooting

If you encounter build issues, try:

1. Add `"typescript": { "ignoreBuildErrors": true }` to `next.config.js`
2. Use `--no-lint` flag with build command
3. For deployment on Vercel, Vercel will handle Next.js configuration automatically
