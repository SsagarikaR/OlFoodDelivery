"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRestaurants = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Users_1 = require("./Users");
const Restaurant_1 = require("./Restaurant");
exports.RatingRestaurants = database_1.sequelize.define('RatingRestaurants', {
    RatingRestaurantID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    RestaurantID: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Restaurant_1.Restaurant,
            key: 'RestaurantID'
        }
    },
    Rating: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    CustomerID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users_1.Users,
            key: 'CustomerID'
        },
        onDelete: 'CASCADE'
    },
}, {
    timestamps: false
});
console.log(exports.RatingRestaurants === database_1.sequelize.models.RatingRestaurants);
