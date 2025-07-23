const verifyToken = require('./verifyToken');

const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, (err) => {
      if (err) {
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
      }
    });

    // Check if user is admin
    if (!req.user.isAdmin && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin verification error:', error);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

module.exports = verifyAdmin; 