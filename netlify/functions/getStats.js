const { Client } = require('pg');

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  await client.connect();
  try {
    // Get post count and total views
    const postsRes = await client.query('SELECT id, views FROM posts');
    const postCount = postsRes.rows.length;
    const totalViews = postsRes.rows.reduce((sum, p) => sum + (p.views || 0), 0);
    // Get comment count
    const commentsRes = await client.query('SELECT id FROM comments');
    const commentCount = commentsRes.rows.length;
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ postCount, commentCount, totalViews })
    };
  } catch (error) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 