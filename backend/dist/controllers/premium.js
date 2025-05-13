"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const order_1 = __importDefault(require("../models/order"));
const user_1 = __importDefault(require("../models/user"));
const userController = __importStar(require("./user"));
const purchasepremium = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        const userId = req.user.id;
        console.log('User ID:', userId);
        const rzp = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const amount = 25000;
        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                console.error('Razorpay error:', err);
                res.status(500).json({ message: 'Failed to create order' });
                return;
            }
            try {
                if (!order || !order.id) {
                    throw new Error('Order not created');
                }
                await order_1.default.create({
                    orderid: order.id,
                    status: 'PENDING',
                });
                res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to save order', error });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};
const updateTransactionStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'Unauthorized user' });
            return;
        }
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await order_1.default.findOne({ where: { orderid: order_id } });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        const userFromDb = await user_1.default.findByPk(userId);
        if (!userFromDb) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        await Promise.all([
            order.update({
                paymentid: payment_id,
                status: 'SUCCESSFUL',
            }),
            userFromDb.update({ isPremium: true }),
        ]);
        const token = userController.generateAccessToken(userId, userFromDb.name || 'Guest', true);
        res.status(202).json({
            success: true,
            message: 'Transaction Successful',
            token,
        });
    }
    catch (err) {
        console.error('Error updating transaction status:', err);
        res.status(500).json({ message: 'Something went wrong', error: err });
    }
};
exports.default = {
    purchasepremium,
    updateTransactionStatus,
};
