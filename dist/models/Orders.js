"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Restaurant_1 = require("./Restaurant");
const Users_1 = require("./Users");
exports.Orders = database_1.sequelize.define('Orders', {
    OrderID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CustomerID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users_1.Users,
            key: 'UserID'
        },
        onDelete: 'CASCADE'
    },
    RestaurantID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Restaurant_1.Restaurant,
            key: 'RestaurantID'
        },
        onDelete: 'CASCADE'
    },
    OrderDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'pending'
    }
}, {
    timestamps: false
});
console.log(exports.Orders === database_1.sequelize.models.Orders);
