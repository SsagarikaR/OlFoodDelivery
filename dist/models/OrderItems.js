"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItems = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const MenuItem_1 = require("./MenuItem");
const Orders_1 = require("./Orders");
exports.OrderItems = database_1.sequelize.define('OrderItems', {
    OrderItemsID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    MenuItemID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MenuItem_1.MenuItems,
            key: 'MenuItemID'
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
    Quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false
});
console.log(exports.OrderItems === database_1.sequelize.models.OrderItems);
