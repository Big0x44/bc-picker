/**
 * Cloudflare Worker to proxy Random.org API requests
 * This keeps the API key secure on the server side
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      // Get API key from environment variable (set via Cloudflare Workers Secrets)
      const apiKey = env.RANDOM_ORG_API_KEY;
      
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Parse request body
      const requestBody = await request.json();
      const { min, max } = requestBody;

      // Validate input
      if (typeof min !== 'number' || typeof max !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid parameters: min and max must be numbers' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      if (min > max) {
        return new Response(
          JSON.stringify({ error: 'Invalid parameters: min must be less than or equal to max' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Prepare Random.org API request
      const randomOrgRequest = {
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: apiKey,
          n: 1,
          min: min,
          max: max,
          replacement: true,
        },
        id: Date.now(),
      };

      // Forward request to Random.org API
      const randomOrgResponse = await fetch('https://api.random.org/json-rpc/4/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(randomOrgRequest),
      });

      if (!randomOrgResponse.ok) {
        return new Response(
          JSON.stringify({ 
            error: `Random.org API error: ${randomOrgResponse.status} ${randomOrgResponse.statusText}` 
          }),
          {
            status: randomOrgResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const randomOrgData = await randomOrgResponse.json();

      // Check for Random.org API errors
      if (randomOrgData.error) {
        return new Response(
          JSON.stringify({ 
            error: randomOrgData.error.message || 'Random.org API error',
            code: randomOrgData.error.code,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Extract and return the random number
      if (randomOrgData.result && randomOrgData.result.random && randomOrgData.result.random.data) {
        return new Response(
          JSON.stringify({ 
            success: true,
            randomNumber: randomOrgData.result.random.data[0],
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Invalid response from Random.org API' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
