"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.post("/register", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const { CustomerAddress } = req.body;
    let AddressID;
    try {
        const IsPartnerExist = await database_1.sequelize.query('SELECT * FROM Delivery_Driver WHERE UserID=?', {
            replacements: [UserID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsPartnerExist.length > 0) {
            return res.status(403).json({ message: "you have already registered as a delivery partner." });
        }
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
            const result = await database_1.sequelize.query(`INSERT INTO Addresses (City, PINCode, street) VALUES (?,?,?)`, {
                replacements: [CustomerAddress.City, CustomerAddress.PINCode, CustomerAddress.street],
                type: sequelize_1.QueryTypes.INSERT
            });
            AddressID = result[0];
            console.log("New Address Created with ID:", AddressID);
        }
        const newPartner = await database_1.sequelize.query('INSERT INTO Delivery_Driver (UserID, AddressID)  VALUES (?,?)', {
            replacements: [UserID, AddressID],
            type: sequelize_1.QueryTypes.INSERT
        });
        return res.status(202).json({ message: "you have successfully registered as a delivery partner" });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
router.patch("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const CustomerAddress = req.body;
    let AddressID;
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
            const newAddress = await database_1.sequelize.query('INSERT INTO Addresses (City,PINCode,street) VALUES (?,?,?)', {
                replacements: [CustomerAddress.City, CustomerAddress.PINCode, CustomerAddress.street],
                type: sequelize_1.QueryTypes.INSERT
            });
            console.log(newAddress, "newAddress");
            AddressID = newAddress[0];
        }
        const updatePartnerAddresID = await database_1.sequelize.query('UPDATE Delivery_Partner SET AddressID=? WHERE UserID=?', {
            replacements: [AddressID, UserID]
        });
    }
    catch (error) {
    }
});
router.delete("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    try {
        const isUserExist = await database_1.sequelize.query(`SELECT * FROM Delivery_Driver WHERE UserID=?`, {
            replacements: [UserID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (isUserExist.length === 0) {
            return res.status(404).json({ message: "You haven't registered as a delivery partner" });
        }
        const deleteAccount = await database_1.sequelize.query('DELETE FROM Delivery_Driver WHERE UserID=?', {
            replacements: [UserID],
            type: sequelize_1.QueryTypes.DELETE
        });
        return res.status(200).json({ message: "You have successfully signed out as delivery partner." });
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
exports.default = router;
