"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignments = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Orders_1 = require("./Orders");
const Delivery_Driver_1 = require("./Delivery_Driver");
exports.Assignments = database_1.sequelize.define('Assignments', {
    AssignmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    OrderID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders_1.Orders,
            key: 'OrderID'
        }
    },
    DeliveryDriverID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Delivery_Driver_1.Delivery_Driver,
            key: 'DeliveryDriverID'
        }
    }
}, {
    timestamps: false
});
console.log(exports.Assignments === database_1.sequelize.models.Assignments);
