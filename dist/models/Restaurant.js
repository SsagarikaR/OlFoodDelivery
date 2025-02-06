"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Address_1 = require("./Address");
const Users_1 = require("./Users");
exports.Restaurant = database_1.sequelize.define('Restaurant', {
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    AddressID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Address_1.Addresses,
            key: 'AddressID'
        }
    },
    OwnerID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users_1.Users,
            key: 'UserID'
        },
        onDelete: 'CASCADE'
    },
    Rating: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    tableName: "Restaurant",
    timestamps: false
});
console.log(exports.Restaurant === database_1.sequelize.models.Restaurant);
