"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({ success: false, message: 'Token missing' });
            return;
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_1.default.findByPk(decoded.userId);
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            isPremium: decoded.ispremiumuser,
        };
        next();
    }
    catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};
exports.authenticate = authenticate;
