import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRATION || '1h';

// Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export default authenticateJWT;