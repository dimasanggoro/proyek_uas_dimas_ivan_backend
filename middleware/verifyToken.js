const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['mybearer'];
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, 'BLABLA123', (err, decoded) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
