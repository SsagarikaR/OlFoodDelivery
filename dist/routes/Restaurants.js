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
    const OwnerID = req.body.UserID.identifire;
    const { City, PINCode, street, RestaurantName, RestaurantContactNo } = req.body;
    // console.log(req.body)
    let AddressID;
    try {
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`, {
            replacements: {
                City: City,
                PINCode: PINCode,
                street: street
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        // console.log(OwnerID);
        // console.log(IsAddressExist);
        if (IsAddressExist.length > 0) {
            AddressID = IsAddressExist[0].AddressID;
        }
        else {
            const newAddress = await Address_1.Addresses.create({ City: City, PINCode: PINCode, street: street });
            console.log(newAddress, "newAddress");
            AddressID = newAddress.dataValues.AddressID;
        }
        // console.log(AddressID);
        const IsRestaurantExist = await database_1.sequelize.query(`SELECT * FROM Restaurant WHERE 
           RestaurantName=:RestaurantName AND 
           RestaurantContactNo=:RestaurantContactNo AND 
           AddressID=:AddressID AND OwnerID=:OwnerID`, {
            replacements: {
                RestaurantName: RestaurantName,
                RestaurantContactNo: RestaurantContactNo,
                AddressID: AddressID,
                OwnerID: OwnerID
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsRestaurantExist, "IsRestaurantExist");
        if (IsRestaurantExist.length > 0) {
            return res.json({ message: "This restaurant is already registered" });
        }
        const newRestaurant = await Restaurant_1.Restaurant.create({ RestaurantName: RestaurantName, RestaurantContactNo: RestaurantContactNo, AddressID: AddressID, OwnerID: OwnerID });
        // console.log(newRestaurant,"newRestaurant");
        return res.json(newRestaurant);
    }
    catch (error) {
        // console.error("Error:", error); 
        return res.status(500).json({ error: "Please try again after some times" });
    }
});
router.get("/", async (req, res) => {
    try {
        const AllRestaurants = await database_1.sequelize.query(`SELECT * FROM Restaurant`);
        if (AllRestaurants.length < 1) {
            return res.json({ message: "No restaurant exist" });
        }
        return res.json(AllRestaurants[0]);
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
exports.default = router;
