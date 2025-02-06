"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Restaurant_1 = require("./Restaurant");
exports.Category = database_1.sequelize.define('Category', {
    CategoryID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CategoryName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    RestaurantID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Restaurant_1.Restaurant,
            key: 'RestaurantID'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: false
});
console.log(exports.Category === database_1.sequelize.models.Category);
