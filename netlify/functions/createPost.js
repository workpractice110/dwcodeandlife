const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { title, content, author, category, tags, published, featured_image, excerpt } = data;
  console.log(data);
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query(
      `INSERT INTO posts (title, content, author, category, tags, published, featured_image, excerpt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, content, author, category, tags, published, featured_image, excerpt]
    );
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0])
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 