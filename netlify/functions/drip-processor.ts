import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// This function is called by Netlify's scheduled functions (cron)
// It calls our Next.js API endpoint to process drip emails

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log("Drip processor scheduled function triggered at:", new Date().toISOString());

  try {
    // Get the site URL from environment
    const siteUrl = process.env.URL || process.env.DEPLOY_URL || 'https://toastcapital.com';
    const cronSecret = process.env.CRON_SECRET || '';

    // Call our API endpoint to process drips
    const response = await fetch(`${siteUrl}/api/drip/process`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    console.log("Drip processing result:", JSON.stringify(result));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Drip processor completed",
        timestamp: new Date().toISOString(),
        result,
      }),
    };
  } catch (error: any) {
    console.error("Drip processor error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Failed to process drips",
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export { handler };
