const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
    }

    try {
        // Token typically comes in format "Bearer <token>"
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_ems');
        
        req.admin = decoded.admin;
        next();
    } catch (err) {
        res.status(401).json({ success: false, msg: 'Token is not valid' });
    }
};

module.exports = auth;
