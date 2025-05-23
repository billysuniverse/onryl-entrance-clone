# Onryl Entrance Clone

This is a clone of the Entrance platform with Onryl branding, built with Next.js 15, Tailwind CSS, and shadcn/ui.

## Features

- Messages page with Twilio integration for SMS messaging
- Campaigns management with creation, analytics, and sending
- Contacts management with filtering and tagging
- Claims dashboard for campaign response handling
- Workspace settings and management
- Dashboard with analytics and metrics

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/onryl-entrance-clone.git
cd onryl-entrance-clone
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Start the development server
```bash
bun run dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Netlify

1. Set up a new site on Netlify
2. Connect your GitHub repository or upload the project files
3. Configure the build settings:
   - Build command: `bun run build`
   - Publish directory: `out`
4. Set the following environment variables:
   - `NEXT_TELEMETRY_DISABLED`: `1`
   - `NODE_ENV`: `production`
5. Deploy!

### Vercel

1. Import the project to Vercel
2. Configure the build settings:
   - Framework preset: Next.js
   - Output directory: Leave default
3. Deploy!

## Technologies Used

- Next.js 15
- Tailwind CSS
- shadcn/ui
- Twilio API (mock)
- Recharts for data visualization
- TypeScript

## License

This project is for demonstration purposes only.
