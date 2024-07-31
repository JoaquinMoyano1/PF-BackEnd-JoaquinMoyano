const verifyToken = require('../config/jwt').verifyToken;

const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    });
};

const isUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    });
};

module.exports = { isAdmin, isUser };
