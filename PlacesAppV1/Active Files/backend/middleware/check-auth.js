const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

// Middleware = checking for valid token
// Accessing authorization header -------- req.headers.authorization

// If the token is not found or is invalid
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication Failed');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error =  new HttpError('Authentication failed.', 403);
        return next (error);
    }
  };
  // wrap in try/catch to avoid SPLIT crash