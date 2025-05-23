// Twilio utility using API endpoints instead of direct Twilio calls

// Phone number pool for 10DLC management
export const phoneNumberPool = [
  '+12025550142',
  '+12025550143',
  '+12025550144',
  '+12025550145',
  '+12025550146',
  '+12025550147',
  '+12025550148',
  '+12025550149',
  '+12025550150',
];

// Function to send SMS using the API endpoint
export async function sendSMS(to: string, body: string, options = {}) {
  try {
    const response = await fetch('/api/twilio/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        body,
        options,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message');
    }

    return result;
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to send messages in bulk using the API endpoint
export async function sendBulkSMS(recipients: string[], body: string, options = {}) {
  try {
    const response = await fetch('/api/twilio/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients,
        body,
        options,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send bulk messages');
    }

    return result;
  } catch (error: any) {
    console.error('Error sending bulk SMS:', error);
    return {
      success: false,
      error: error.message,
      total: recipients.length,
      sent: 0,
      failed: recipients.length,
      results: recipients.map(to => ({
        success: false,
        to,
        error: error.message,
      })),
    };
  }
}

// Function to get message history
// This would typically interact with your database or Twilio API
export async function getMessageHistory(options = {}) {
  try {
    // In a real app, you would fetch this from your database
    // or make an API call to Twilio to get message history
    return {
      success: true,
      messages: [],
    };
  } catch (error: any) {
    console.error('Error getting message history:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Function to get a specific message
export async function getMessage(messageSid: string) {
  try {
    // In a real app, you would fetch this from your database
    // or make an API call to Twilio to get the message
    return {
      success: true,
      message: null,
    };
  } catch (error: any) {
    console.error('Error getting message:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export the functions directly
// No need for different methods for dev/prod since the API routes handle that
export const sendSMSSafe = sendSMS;
export const sendBulkSMSSafe = sendBulkSMS;
