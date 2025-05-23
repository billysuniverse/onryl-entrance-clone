'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CampaignDetailContent from './content';

export default function CampaignDetailClient({ id }: { id: string }) {
  const params = useParams();
  const router = useRouter();
  return <CampaignDetailContent id={id} router={router} />;
}
