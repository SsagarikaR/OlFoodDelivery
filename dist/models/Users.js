"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.Users = database_1.sequelize.define('Users', {
    CustomerID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CustomerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    CustomerEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    CustomerContactNo: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});
console.log(exports.Users === database_1.sequelize.models.Users);
