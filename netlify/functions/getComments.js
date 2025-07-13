const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const post_id = event.queryStringParameters && event.queryStringParameters.post_id;
  if (!post_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing post_id parameter' })
    };
  }

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC', [post_id]);
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 