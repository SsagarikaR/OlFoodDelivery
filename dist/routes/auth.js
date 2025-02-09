"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const authentication_1 = require("../config/authentication");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: API for user signup and signin
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User Authentication]
 *     description: Creates a new user account if the username and email are not already taken.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserName
 *               - UserEmail
 *               - UserContactNo
 *               - password
 *             properties:
 *               UserName:
 *                 type: string
 *               UserEmail:
 *                 type: string
 *               UserContactNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/signup", async (req, res) => {
    const { UserName, UserEmail, UserContactNo, password } = req.body;
    try {
        const IsExistName = await database_1.sequelize.query('SELECT * from Users where UserName=:UserName', {
            replacements: { UserName: UserName },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsExistName, "UserName");
        if (IsExistName.length > 0) {
            return res.json({ message: "A user with this name already exist" });
        }
        const IsExistEmail = await database_1.sequelize.query('SELECT * from Users where UserEmail=:UserEmail', {
            replacements: { UserEmail: UserEmail },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsExistEmail, "UserName");
        if (IsExistEmail.length > 0) {
            return res.json({ message: "This email is already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await database_1.sequelize.query('INSERT INTO Users (UserName, UserEmail, UserContactNo,password) VALUES (?,?,?,?)', {
            replacements: [UserName, UserEmail, UserContactNo, hashedPassword],
            type: sequelize_1.QueryTypes.INSERT
        });
        console.log(newUser);
        const token = await (0, authentication_1.getToken)(newUser[0]);
        return res.json(token);
    }
    catch (error) {
        console.error(error);
        return res.json({ error: "Please try again" });
    }
});
/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate user
 *     tags: [User Authentication]
 *     description: Logs in a user if credentials match an existing account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserName
 *               - UserEmail
 *               - UserContactNo
 *               - password
 *             properties:
 *               UserName:
 *                 type: string
 *               UserEmail:
 *                 type: string
 *               UserContactNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/signin", async (req, res) => {
    const { UserName, UserEmail, UserContactNo, password } = req.body;
    try {
        const user = await database_1.sequelize.query('SELECT * from Users where UserName=:UserName AND UserEmail=:UserEmail AND  UserContactNo=:UserContactNo', {
            replacements: {
                UserName: UserName,
                UserEmail: UserEmail,
                UserContactNo: UserContactNo,
                LIMIT: 1
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (user.length < 1) {
            return res.send({ message: "user doesn't exist" });
        }
        if (user[0].password) {
            const isPasswordValid = await bcryptjs_1.default.compare(password, user[0].password);
            if (!isPasswordValid) {
                return res.json({ message: "invalid pssword" });
            }
        }
        console.log(user, "logged in user");
        const userToReturn = user[0];
        console.log(userToReturn, "userToReturn");
        const token = await (0, authentication_1.getToken)(user[0].UserID);
        userToReturn.token = token;
        delete userToReturn.password;
        return res.json(userToReturn);
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again" });
    }
});
exports.default = router;
