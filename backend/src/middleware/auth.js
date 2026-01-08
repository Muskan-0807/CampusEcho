
const jwt = require('jsonwebtoken');
const User = require("../models/User");


const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please login.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user= await User.findById(decoded._id).select("-password");

    if(!user){
        return res.status(401).json({
            message:"User not found"
        });
    }
    req.user=user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Authority only.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };