"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import mysql from "mysql";
const Address_1 = require("./models/Address");
require("./config/database");
const Customer_1 = __importDefault(require("./routes/Customer"));
const Restaurants_1 = __importDefault(require("./routes/Restaurants"));
const Users_1 = require("./models/Users");
const CustomerAdress_1 = require("./models/CustomerAdress");
const Restaurant_1 = require("./models/Restaurant");
const Category_1 = require("./models/Category");
const MenuItem_1 = require("./models/MenuItem");
const Orders_1 = require("./models/Orders");
const OrderItems_1 = require("./models/OrderItems");
const RatingRestaurant_1 = require("./models/RatingRestaurant");
const RatingDriver_1 = require("./models/RatingDriver");
const Payments_1 = require("./models/Payments");
const Assignments_1 = require("./models/Assignments");
const Delivery_Driver_1 = require("./models/Delivery_Driver");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
(async () => {
    await Address_1.Address.sync();
    await Users_1.Users.sync();
    await CustomerAdress_1.Customer_Address.sync();
    await Restaurant_1.Restaurant.sync({ alter: true });
    await Category_1.Category.sync();
    await MenuItem_1.MenuItems.sync();
    await Orders_1.Orders.sync();
    await OrderItems_1.OrderItems.sync();
    await RatingRestaurant_1.RatingRestaurants.sync();
    await RatingDriver_1.RatingDriver.sync();
    await Payments_1.Payments.sync();
    await Assignments_1.Assignments.sync();
    await Delivery_Driver_1.Delivery_Driver.sync();
    // await sequelize.sync({alter:true});
    // console.log("table synced")
})();
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});
app.use("/customers", Customer_1.default);
app.use("/restaurants", Restaurants_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
