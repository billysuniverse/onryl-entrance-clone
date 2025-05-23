// This is a server component
import { Suspense } from 'react';
import CampaignDetailClient from './client';

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  // Generate params for campaign IDs 1-5 (from our mock data)
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
  ];
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CampaignDetailClient id={params.id} />
    </Suspense>
  );
}
