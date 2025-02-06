"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addresses = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.Addresses = database_1.sequelize.define('Addresses', {
    AddressID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    City: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    PINCode: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    street: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'Addresses',
    timestamps: false
});
console.log(exports.Addresses === database_1.sequelize.models.Addresses);
