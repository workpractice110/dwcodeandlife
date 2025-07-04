const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get post count and total views
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id,views');
  if (postsError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: postsError.message })
    };
  }
  const postCount = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Get comment count
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('id');
  if (commentsError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: commentsError.message })
    };
  }
  const commentCount = comments.length;

  return {
    statusCode: 200,
    body: JSON.stringify({ postCount, commentCount, totalViews })
  };
}; 