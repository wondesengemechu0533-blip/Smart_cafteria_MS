const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { normalizeRole } = require('../validators/common.validator');

const protect = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });

    try {
        const tokenUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(tokenUser.id).select('name email phone role status isActive');
        if (!user) {
            return res.status(401).json({ success: false, error: 'User account not found' });
        }
        if (user.status !== 'ACTIVE' || user.isActive === false) {
            return res.status(403).json({ success: false, error: 'Account is inactive or suspended' });
        }
        req.user = {
            ...tokenUser,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: normalizeRole(user.role)
        };
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }
        console.error('❌ Authentication lookup error:', error);
        return res.status(500).json({ success: false, error: 'Authentication service unavailable' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    // Normalize roles for comparison (case-insensitive)
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());
    
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    next();
};

module.exports = { protect, authorize };