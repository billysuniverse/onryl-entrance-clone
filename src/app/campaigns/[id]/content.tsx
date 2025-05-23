import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCampaignSafe } from '@/lib/campaign';
import CampaignDetailLayout from '@/components/campaigns/CampaignDetailLayout';

export default function CampaignDetailContent({ id, router }: { id: string; router: any }) {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaign() {
      const result = await getCampaignSafe(Number(id));
      if (!result.campaign) {
        toast({ title: 'Campaign not found', variant: 'destructive' });
        router.push('/campaigns');
      } else {
        setCampaign(result.campaign);
      }
      setLoading(false);
    }
    fetchCampaign();
  }, [id, router, toast]);

  if (loading) return <div>Loading...</div>;
  if (!campaign) return null;

  return <CampaignDetailLayout campaign={campaign} router={router} />;
}
