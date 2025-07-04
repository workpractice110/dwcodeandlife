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

  const post_id = event.queryStringParameters && event.queryStringParameters.post_id;
  if (!post_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing post_id parameter' })
    };
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(comments)
  };
}; 