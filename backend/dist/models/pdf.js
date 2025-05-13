"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
class PDF extends sequelize_1.Model {
}
PDF.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    storedFilename: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    originalFilename: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    filePath: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    uploadDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    modelName: 'PDF',
});
exports.default = PDF;
