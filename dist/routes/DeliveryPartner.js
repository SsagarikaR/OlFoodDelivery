"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /delivery-partners/register:
 *   post:
 *     summary: Register as a delivery partner
 *     tags: [Delivery Partner Routes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CustomerAddress
 *             properties:
 *               CustomerAddress:
 *                 type: object
 *                 properties:
 *                   City: { type: string }
 *                   PINCode: { type: string }
 *                   street: { type: string }
 *     responses:
 *       202:
 *         description: Successfully registered as a delivery partner
 *       403:
 *         description: Already registered as a delivery partner
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
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
/**
* @openapi
* /delivery-partners:
*   patch:
*     summary: Update delivery partner address
*     tags: [Delivery Partner Routes]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - CustomerAddress
*             properties:
*               CustomerAddress:
*                 type: object
*                 properties:
*                   City: { type: string }
*                   PINCode: { type: string }
*                   street: { type: string }
*     responses:
*       200:
*         description: Successfully updated address
*       500:
*         description: Internal server error
*     securityDefinitions:
*       authorization:
*         type: apiKey
*         in: header
*         name: Authorization
*         description: "JWT Token required for authentication"
*/
router.patch("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const { CustomerAddress } = req.body;
    let AddressID;
    try {
        console.log(CustomerAddress);
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Addresses WHERE City=? AND PINCode=? AND street=?`, {
            replacements: [
                CustomerAddress.City,
                CustomerAddress.PINCode,
                CustomerAddress.street
            ],
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
        const updatePartnerAddresID = await database_1.sequelize.query('UPDATE Delivery_Driver SET AddressID=? WHERE UserID=?', {
            replacements: [AddressID, UserID]
        });
        return res.status(200).json({ message: "You have successfully updated your address" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
/**
* @openapi
* /delivery-partner:
*   delete:
*     summary: Delete delivery partner registration
*     tags: [Delivery Partner Routes]
*     security:
*       - BearerAuth: []
*     responses:
*       200:
*         description: Successfully signed out as delivery partner
*       404:
*         description: Not registered as a delivery partner
*       500:
*         description: Internal server error
*     securityDefinitions:
*       authorization:
*         type: apiKey
*         in: header
*         name: Authorization
*         description: "JWT Token required for authentication"
*/
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
/**
* @openapi
* /delivery-partners:
*   get:
*     summary: Get all registered delivery partners
*     tags: [Delivery Partner Routes]
*     responses:
*       200:
*         description: Successfully retrieved all delivery partners
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   UserID: { type: string }
*                   AddressID: { type: number }
*       500:
*         description: Internal server error
*/
router.get("/", async (req, res) => {
    try {
        // Fetch all delivery partners from the Delivery_Driver table
        const deliveryPartners = await database_1.sequelize.query(`SELECT * FROM Delivery_Driver`, {
            type: sequelize_1.QueryTypes.SELECT
        });
        // Check if any delivery partners exist
        if (deliveryPartners.length === 0) {
            return res.status(404).json({ message: "No delivery partners found" });
        }
        return res.status(200).json(deliveryPartners);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Please try again after some time!" });
    }
});
exports.default = router;
