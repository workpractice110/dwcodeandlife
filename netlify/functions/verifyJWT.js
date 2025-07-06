const jwt = require('jsonwebtoken');

module.exports = function verifyJWT(event) {
  const auth = event.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return null;
  }
  const token = auth.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}; 