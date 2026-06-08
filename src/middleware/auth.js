const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    // Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    console.log('Token:', token);

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // store decoded info for use in controllers
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };