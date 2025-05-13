"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = setupAssociations;
const user_1 = __importDefault(require("./user"));
const pdf_1 = __importDefault(require("./pdf"));
function setupAssociations() {
    user_1.default.hasMany(pdf_1.default, { foreignKey: 'userId' });
    pdf_1.default.belongsTo(user_1.default, { foreignKey: 'userId' });
}
