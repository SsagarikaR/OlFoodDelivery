"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const express_1 = require("express");
const Address_1 = require("../models/Address");
const OrderItems_1 = require("../models/OrderItems");
const router = (0, express_1.Router)();
router.post("/:restaurantID/new", authorization_1.checkToken, async (req, res) => {
    const { MenuItems, CustomerAddress } = req.body;
    const { restaurantID } = req.params;
    const CustomerID = req.body.UserID.identifire;
    let AddressID;
    let CustomerAddressID;
    try {
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`, {
            replacements: {
                City: CustomerAddress.City,
                PINCode: CustomerAddress.PINCode,
                street: CustomerAddress.street
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsAddressExist.length > 0) {
            AddressID = IsAddressExist[0].AddressID;
        }
        else {
            const newAddress = await Address_1.Addresses.create({ City: CustomerAddress.City, PINCode: CustomerAddress.PINCode, street: CustomerAddress.street });
            console.log(newAddress, "newAddress");
            AddressID = newAddress.dataValues.AddressID;
        }
        const IsCustomerAdressExist = await database_1.sequelize.query(`SELECT * FROM Customer_Address WHERE CustomerID=? AND AddressID=?`, {
            replacements: [CustomerID, AddressID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsCustomerAdressExist.length > 0) {
            CustomerAddressID = IsCustomerAdressExist[0].CustomerAddressID;
        }
        else {
            const newCustomerAddress = await CustomerAddress.create({ CustomerID: CustomerID, AddressID: AddressID });
            console.log(newCustomerAddress, "newAddress");
            CustomerAddressID = newCustomerAddress.dataValues.AddressID;
        }
        const [result, metadata] = await database_1.sequelize.query(`INSERT into Orders (CustomerID,RestaurantID)VALUES (?,?)`, {
            replacements: [CustomerID, restaurantID],
            type: sequelize_1.QueryTypes.INSERT
        });
        if (metadata > 0) {
            const CreateOrderItem = await OrderItems_1.OrderItems.bulkCreate(MenuItems);
            console.log(CreateOrderItem);
            const createdOrder = await database_1.sequelize.query('SELECT * FROM Orders WHERE CustomerID= ?', {
                replacements: [CustomerID],
                type: sequelize_1.QueryTypes.SELECT
            });
            return res.status(500).json(createdOrder);
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try again after sometimes!!" });
    }
});
exports.default = router;
