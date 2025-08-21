
const fs = require('fs').promises;
const path = require('path');

// Simple file-based storage (you could upgrade to a database later)
const dataPath = '/tmp/waitlist.json';

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get waitlist
      try {
        const data = await fs.readFile(dataPath, 'utf8');
        return {
          statusCode: 200,
          headers,
          body: data
        };
      } catch (error) {
        // File doesn't exist yet, return empty waitlist
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ waitlist: [] })
        };
      }
    }

    if (event.httpMethod === 'POST') {
      // Save waitlist
      const data = event.body;
      await fs.writeFile(dataPath, data);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
