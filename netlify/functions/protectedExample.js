const verifyJWT = require('./verifyJWT');

exports.handler = async function(event) {
  const user = verifyJWT(event);
  if (!user) {
    return { statusCode: 401, body: 'Unauthorized' };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello, ${user.username}! This is a protected endpoint.` })
  };
}; 