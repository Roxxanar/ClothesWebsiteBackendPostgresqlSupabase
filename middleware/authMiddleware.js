const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect: Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // save payload
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;

