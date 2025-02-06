"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Orders_1 = require("./Orders");
const Users_1 = require("./Users");
exports.Payments = database_1.sequelize.define('Payments', {
    PaymentID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    PaymentMethod: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users_1.Users,
            key: 'CustomerID'
        },
        onDelete: 'CASCADE'
    },
    OrderID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders_1.Orders,
            key: 'OrderID'
        },
        onDelete: 'CASCADE'
    },
    OrderItemsPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    PlatformCharge: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    TotalPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    Payment_status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'pending'
    },
    Payment_Date: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    timestamps: false
});
console.log(exports.Payments === database_1.sequelize.models.Payments);
