"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const express_1 = require("express");
const Address_1 = require("../models/Address");
const Restaurant_1 = require("../models/Restaurant");
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
router.post("/register", authorization_1.checkToken, async (req, res) => {
    const OwnerID = req.body.customerID.identifire;
    const { City, PINCode, street, RestaurantName, RestaurantContactNo } = req.body;
    // console.log(req.body)
    let addressID;
    try {
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Address WHERE City=:City AND PINCode=:PINCode AND street=:street`, {
            replacements: {
                City: City,
                PINCode: PINCode,
                street: street
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsAddressExist);
        if (IsAddressExist.length > 0) {
            addressID = IsAddressExist[0].AddressID;
        }
        else {
            const newAddress = await Address_1.Address.create({ City: City, PINCode: PINCode, street: street });
            console.log(newAddress, "newAddress");
            addressID = newAddress.dataValues.AddressID;
        }
        console.log(addressID);
        const newRestaurant = await Restaurant_1.Restaurant.create({ RestaurantName: RestaurantName, RestaurantContactNo: RestaurantContactNo, AddressID: addressID, OwnerID: OwnerID });
        console.log(newRestaurant, "newRestaurant");
        return res.json(newRestaurant);
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again after some times" });
    }
});
router.get("/", async (req, res) => {
    try {
        const AllRestaurants = await database_1.sequelize.query(`SELECT * FROM Restaurant`);
        if (AllRestaurants.length < 1) {
            return res.json({ message: "No restaurant exist" });
        }
        return res.json(AllRestaurants);
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
exports.default = router;
