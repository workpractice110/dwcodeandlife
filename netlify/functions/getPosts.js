const { Client } = require('pg');

exports.handler = async function(event) {
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 