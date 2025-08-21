const JSONBIN_API_KEY = '$2a$10$yllROdMvpk29V6bEF4yfXuNhuHZeNCoZDxG0zzN7jN7rTKyL/teby'; // Get from jsonbin.io
const BIN_ID = '68a79a80ae596e708fd08b9f'; // Create a bin and get this ID

exports.handler = async (event, context) => {
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
      // Get waitlist from JSONBin
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });
      const data = await response.json();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.record || { waitlist: [] })
      };
    }

    if (event.httpMethod === 'POST') {
      // Save waitlist to JSONBin
      const waitlistData = JSON.parse(event.body);
      
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(waitlistData)
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
