"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItems = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Category_1 = require("./Category");
const Restaurant_1 = require("./Restaurant");
exports.MenuItems = database_1.sequelize.define('MenuItems', {
    MenuItemID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    ItemName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ItemPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    CategoryID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category_1.Category,
            key: 'CategoryID'
        }
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
console.log(exports.MenuItems === database_1.sequelize.models.MenuItems);
