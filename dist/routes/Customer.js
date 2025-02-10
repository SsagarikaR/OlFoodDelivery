"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const authorization_1 = require("../config/authorization");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: "Delete a user account"
 *     tags: [User Routes]
 *     security:
 *       - BearerAuth: []  # Authorization required to delete user
 *     responses:
 *       204:
 *         description: "Account deleted successfully"
 *       404:
 *         description: "User not found"
 *       500:
 *         description: "Internal server error"
 * securityDefinitions:
 *   authorization:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: "JWT Token required for authentication"
 */
router.delete("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire; // Assuming 'UserID' is decoded from the JWT token
    console.log(UserID, "customerID");
    try {
        // Check if the user exists in the database
        const deleteUser = await database_1.sequelize.query(`SELECT * FROM Users WHERE UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.SELECT
        });
        // If user doesn't exist, return an error message
        if (deleteUser.length === 0) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        // Delete the user account from the database
        await database_1.sequelize.query(`DELETE FROM Users where UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.DELETE
        });
        return res.status(204).json({ message: "Account deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again after some time" });
    }
});
/**
 * @swagger
 * /users/password/change:
 *   patch:
 *     summary: Change user password
 *     tags: [User Routes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.patch("/password/change", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const { password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const updatePassword = await database_1.sequelize.query(`UPDATE Users SET password=:password WHERE UserID=:UserID`, {
            replacements: {
                UserID: UserID,
                password: hashedPassword
            }
        });
        const updatedUser = await database_1.sequelize.query(`SELECT * FROM Users WHERE UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(updatedUser);
        return res.json({ message: "password updated successfully" });
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user details
 *     tags: [User Routes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object  # Or a more specific schema if you have one
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.get("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    console.log(req.body);
    console.log(UserID);
    try {
        console.log("customers data");
        const Users = await database_1.sequelize.query(`SELECT * from Users WHERE UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(Users);
        return res.json(Users);
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all user details (admin only)
 *     tags: [User Routes]
 *     responses:
 *       200:
 *         description: All user details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Or a more specific schema
 *       500:
 *         description: Internal server error
 */
router.get("/all", async (req, res) => {
    try {
        console.log("customers data");
        const Users = await database_1.sequelize.query(`SELECT * from Users `, {
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(Users);
        return res.json(Users);
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
exports.default = router;
