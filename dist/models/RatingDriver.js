"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingDriver = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Users_1 = require("./Users");
const Delivery_Driver_1 = require("./Delivery_Driver");
exports.RatingDriver = database_1.sequelize.define('RatingDriver', {
    RatingDeliveryDriverID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Rating: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    DeliveryDriverID: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Delivery_Driver_1.Delivery_Driver,
            key: 'DeliveryDriverID'
        }
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
}, {
    timestamps: false
});
console.log(exports.RatingDriver === database_1.sequelize.models.RatingDriver);
