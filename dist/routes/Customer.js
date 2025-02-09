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
 *     summary: Delete a user account
 *     tags: [User Routes]
 *     security:
 *       - authorization: []
 *     responses:
 *       204:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/", authorization_1.checkToken, async (req, res) => {
    // console.log(req.body);
    const UserID = req.body.UserID.identifire;
    console.log(UserID, "customerID");
    try {
        const deleteUser = await database_1.sequelize.query(`SELECT * FROM Users WHERE UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (deleteUser.length === 0) {
            return res.json({ message: "User doesn't exist" });
        }
        const deleteAccount = await database_1.sequelize.query(`DELETE FROM Users where UserID=:UserID`, {
            replacements: { UserID: UserID },
            type: sequelize_1.QueryTypes.DELETE
        });
        return res.status(204).json({ Message: "Account deleted successfully" });
        // console.log(deleteAccount);
    }
    catch (error) {
        return res.json({ Error: "Please try again after some times" });
    }
});
/**
 * @swagger
 * /users/password/change:
 *   patch:
 *     summary: Change user password
 *     tags: [User Routes]
 *     security:
 *       - authorization: []
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
 *       - authorization: []
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
