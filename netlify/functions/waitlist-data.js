
const JSONBIN_API_KEY = '$2a$10$yllROdMvpk29V6bEF4yfXuNhuHZeNCoZDxG0zzN7jN7rTKyL/teby'; // Your actual key
const BIN_ID = '68a79a80ae596e708fd08b9f'; // Your actual bin ID

exports.handler = async (event, context) => {
  console.log('Function called:', event.httpMethod);
  
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
      console.log('Getting waitlist from JSONBin...');
      
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });
      
      console.log('JSONBin response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`JSONBin API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data from JSONBin:', data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.record || { waitlist: [] })
      };
    }

    if (event.httpMethod === 'POST') {
      console.log('Saving waitlist to JSONBin...');
      console.log('Request body:', event.body);
      
      const waitlistData = JSON.parse(event.body);
      
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(waitlistData)
      });

      console.log('Save response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`JSONBin save error: ${response.status}`);
      }

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
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
