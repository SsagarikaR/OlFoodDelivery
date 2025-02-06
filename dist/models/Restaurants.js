"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Address_1 = require("./Address");
const Customer_1 = require("./Customer");
exports.Restaurant = database_1.sequelize.define(' Restaurant', {
    RestaurantID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    RestaurantName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    RestaurantContactNo: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
    },
    AddressID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address_1.Address,
            key: 'AddressID'
        }
    },
    OwnerID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer_1.Customers,
            key: 'CustomerID'
        }
    }
}, {
    timestamps: false
});
console.log(exports.Restaurant === database_1.sequelize.models.Customers);
