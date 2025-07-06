const { Client } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { username, password } = JSON.parse(event.body);
  if (!username || !password) {
    return { statusCode: 400, body: 'Missing username or password' };
  }
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    const hash = await bcrypt.hash(password, 10);
    await client.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username, hash]
    );
    await client.end();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    await client.end();
    return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
  }
}; 