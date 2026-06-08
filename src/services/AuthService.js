const jwt = require('jsonwebtoken');
const SECRET = '6bA!{8eK@3Zq#9tN$5Vr^1Xp&7Yw*2Hs%4Jm?0Lb|';

// Functions for creating and verifying tokens
function generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };