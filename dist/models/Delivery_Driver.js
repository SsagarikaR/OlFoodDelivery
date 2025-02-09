"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery_Driver = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Users_1 = require("./Users");
const Address_1 = require("./Address");
exports.Delivery_Driver = database_1.sequelize.define('Delivery_Driver', {
    DeliveryDriverID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    UserID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users_1.Users,
            key: 'UserID'
        },
        onDelete: 'CASCADE'
    },
    AddressID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address_1.Addresses,
            key: 'AddressID'
        }
    },
    Rating: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: 'Delivery_Driver',
    timestamps: false
});
console.log(exports.Delivery_Driver === database_1.sequelize.models.Delivery_Driver);
