const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'PATCH') {
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

  const { id, ...fields } = data;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id' })
    };
  }

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    // Build dynamic SET clause
    const setClause = Object.keys(fields).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const result = await client.query(
      `UPDATE posts SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    await client.end();
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Post not found' })
      };
    }
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