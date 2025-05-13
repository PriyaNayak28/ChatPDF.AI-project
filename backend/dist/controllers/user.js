"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.generateAccessToken = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const isStringInvalid = (input) => {
    return !input || input.length === 0;
};
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (isStringInvalid(name) ||
            isStringInvalid(email) ||
            isStringInvalid(password)) {
            res.status(400).json({ err: 'Bad parameters. Something is missing' });
            return;
        }
        const saltRounds = 10;
        const hash = await bcrypt_1.default.hash(password, saltRounds);
        await user_1.default.create({ name, email, password: hash });
        res.status(201).json({ message: 'Successfully created new user' });
    }
    catch (err) {
        res.status(403).json({ error: err });
    }
};
exports.signup = signup;
const generateAccessToken = async (id, name, ispremiumuser) => {
    return jsonwebtoken_1.default.sign({ userId: id, name, ispremiumuser }, process.env.JWT_SECRET || '#@focus28ABCDabcd');
};
exports.generateAccessToken = generateAccessToken;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringInvalid(email) || isStringInvalid(password)) {
            res
                .status(400)
                .json({ message: 'Email or Password is missing', success: false });
            return;
        }
        const users = (await user_1.default.findAll({ where: { email } }));
        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                const token = await generateAccessToken(user.id, user.name, user.isPremium);
                res.status(200).json({
                    success: true,
                    message: 'User Logged in successfully',
                    token,
                });
            }
            else {
                res
                    .status(400)
                    .json({ success: false, message: 'Password is incorrect' });
            }
        }
        else {
            res.status(404).json({ success: false, message: 'User does not exist' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};
exports.login = login;
const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ name: user.name, isPremium: user.isPremium });
    }
    catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
exports.getUserProfile = getUserProfile;
