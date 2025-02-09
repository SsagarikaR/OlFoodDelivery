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
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserName:
 *                 type: string
 *                 description: The user's username
 *               UserEmail:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               UserContactNo:
 *                 type: string
 *                 description: The user's contact number
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Returns the authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: string  # Assuming the token is a string
 *       400:
 *         description: Bad request (e.g., username or email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
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
        // Hashing the password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        //Creating new User
        const newUser = await database_1.sequelize.query('INSERT INTO Users (UserName, UserEmail, UserContactNo,password) VALUES (?,?,?,?)', {
            replacements: [UserName, UserEmail, UserContactNo, hashedPassword],
            type: sequelize_1.QueryTypes.INSERT
        });
        //  Users.create({UserName: UserName, UserEmail: UserEmail, UserContactNo:UserContactNo,password: hashedPassword})
        //Creating token and returning it to the User
        console.log(newUser);
        const token = await (0, authentication_1.getToken)(newUser[0]);
        // console.log("Customer added: ", newUser);
        // const userToReturn=newUser.toJSON();
        // userToReturn.token=token;
        // delete userToReturn.password;
        return res.json(token);
    }
    catch (error) {
        console.error(error);
        return res.json({ error: "Please try again" });
    }
});
router.post("/signin", async (req, res) => {
    const { UserName, UserEmail, UserContactNo, password } = req.body;
    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
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
