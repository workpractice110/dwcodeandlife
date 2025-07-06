const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { username, password } = JSON.parse(event.body);
  if (!username || !password) {
    return { statusCode: 400, body: 'Missing username or password' };
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    await client.end();
    if (res.rows.length === 0) {
      return { statusCode: 401, body: 'Invalid credentials' };
    }
    const user = res.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { statusCode: 401, body: 'Invalid credentials' };
    }
    // Create a JWT token (set a secret in your Netlify env vars)
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { statusCode: 200, body: JSON.stringify({ token }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};