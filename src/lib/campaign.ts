// Campaign utility functions

// Function to fetch campaigns
export async function getCampaigns() {
  try {
    // In a real app, this would fetch from the API
    // For now, we'll return a success response
    return {
      success: true,
      campaigns: [],
    };
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to get a specific campaign
export async function getCampaign(id: number) {
  try {
    // In a real app, this would fetch from the API
    // For now, we'll return a success response
    return {
      success: true,
      campaign: null,
    };
  } catch (error: any) {
    console.error('Error fetching campaign:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to create a campaign
export async function createCampaign(campaign: any) {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create campaign');
    }

    return {
      success: true,
      campaign: result.campaign,
    };
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to update a campaign
export async function updateCampaign(id: number, updates: any) {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update campaign');
    }

    return {
      success: true,
      campaign: result.campaign,
    };
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to run a campaign
export async function runCampaign(id: number) {
  try {
    const response = await fetch('/api/campaigns/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId: id }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to run campaign');
    }

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error('Error running campaign:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to delete a campaign
export async function deleteCampaign(id: number) {
  try {
    // In a real app, this would call an API
    // For now, we'll return a success response
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error deleting campaign:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export safe versions of the functions
export const getCampaignsSafe = getCampaigns;
export const getCampaignSafe = getCampaign;
export const createCampaignSafe = createCampaign;
export const updateCampaignSafe = updateCampaign;
export const runCampaignSafe = runCampaign;
export const deleteCampaignSafe = deleteCampaign;
