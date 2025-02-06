"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery_Driver = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
exports.Delivery_Driver = database_1.sequelize.define('Delivery_Driver', {
    DeliveryDriverID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    DeliveryDriverName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    DeliveryDriverContact: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    DeliveryDriverEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Rating: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'Delivery_Driver',
    timestamps: false
});
console.log(exports.Delivery_Driver === database_1.sequelize.models.Delivery_Driver);
