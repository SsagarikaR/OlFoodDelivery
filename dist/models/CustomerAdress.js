"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer_Address = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Address_1 = require("./Address");
const Users_1 = require("./Users");
exports.Customer_Address = database_1.sequelize.define('Customer_Address', {
    CustomerAddressID: {
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
    AddressID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address_1.Addresses,
            key: 'AddressID'
        }
    }
}, {
    tableName: 'Customer_Address',
    timestamps: false
});
console.log(exports.Customer_Address === database_1.sequelize.models.Customer_Address);
