"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const Users_1 = require("../models/Users");
const authentication_1 = require("../config/authentication");
const authorization_1 = require("../config/authorization");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    const { CustomerName, CustomerEmail, CustomerContactNo, password } = req.body;
    try {
        const IsExistName = await database_1.sequelize.query('SELECT * from Users where CustomerName=:CustomerName', {
            replacements: { CustomerName: CustomerName },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsExistName, "CustomerName");
        if (IsExistName.length > 0) {
            return res.json({ message: "A user with this name already exist" });
        }
        const IsExistEmail = await database_1.sequelize.query('SELECT * from Users where CustomerEmail=:CustomerEmail', {
            replacements: { CustomerEmail: CustomerEmail },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsExistEmail, "CustomerName");
        if (IsExistEmail.length > 0) {
            return res.json({ message: "This email is already registered" });
        }
        // Hashing the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        //Creating new User
        const newUser = await Users_1.Users.create({ CustomerName: CustomerName, CustomerEmail: CustomerEmail, CustomerContactNo: CustomerContactNo, password: hashedPassword });
        //Creating token and returning it to the User
        const token = await (0, authentication_1.getToken)(newUser.dataValues.CustomerID);
        console.log("Customer added: ", newUser);
        const userToReturn = newUser.toJSON();
        userToReturn.token = token;
        delete userToReturn.password;
        return res.json(userToReturn);
    }
    catch (error) {
        console.error(error);
        return res.json({ error: "Please try again" });
    }
});
router.post("/login", async (req, res) => {
    const { CustomerName, CustomerEmail, CustomerContactNo, password } = req.body;
    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = await database_1.sequelize.query('SELECT * from Users where CustomerName=:CustomerName AND customerEmail=:CustomerEmail AND  CustomerContactNo=:CustomerContactNo', {
            replacements: {
                CustomerName: CustomerName,
                CustomerEmail: CustomerEmail,
                CustomerContactNo: CustomerContactNo,
                LIMIT: 1
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (user.length < 1) {
            return res.send({ message: "user doesn't exist" });
        }
        if (user[0].password) {
            const isPasswordValid = await bcrypt_1.default.compare(password, user[0].password);
            if (!isPasswordValid) {
                return res.json({ message: "invalid pssword" });
            }
        }
        console.log(user, "logged in user");
        const userToReturn = user[0];
        console.log(userToReturn, "userToReturn");
        const token = await (0, authentication_1.getToken)(user[0].CustomerID);
        userToReturn.token = token;
        delete userToReturn.password;
        return res.json(userToReturn);
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again" });
    }
});
router.delete("/close", authorization_1.checkToken, async (req, res) => {
    // console.log(req.body);
    const CustomerID = req.body.customerID.identifire;
    console.log(CustomerID, "customerID");
    try {
        const deleteUser = await database_1.sequelize.query(`SELECT * FROM Users WHERE CustomerID=:CustomerID`, {
            replacements: { CustomerID: CustomerID },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (deleteUser.length === 0) {
            return res.json({ message: "User doesn't exist" });
        }
        const deleteAccount = await database_1.sequelize.query(`DELETE FROM Users where CustomerID=:CustomerID`, {
            replacements: { CustomerID: CustomerID },
            type: sequelize_1.QueryTypes.DELETE
        });
        return res.json({ message: "Account deleted successfully" });
        // console.log(deleteAccount);
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
router.patch("/password/change", authorization_1.checkToken, async (req, res) => {
    const CustomerID = req.body.customerID.identifire;
    const { password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const updatePassword = await database_1.sequelize.query(`UPDATE Users SET password=:password WHERE CustomerID=:CustomerID`, {
            replacements: {
                CustomerID: CustomerID,
                password: hashedPassword
            }
        });
        const updatedUser = await database_1.sequelize.query(`SELECT * FROM Users WHERE CustomerID=:CustomerID`, {
            replacements: { CustomerID: CustomerID },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(updatedUser);
        return res.json({ message: "password updated successfully" });
    }
    catch (error) {
        return res.json({ error: "Please try again after some times" });
    }
});
router.get("/", authorization_1.checkToken, async (req, res) => {
    const CustomerID = req.body.customerID.identifire;
    try {
        console.log("customers data");
        const Users = await database_1.sequelize.query(`SELECT * from Users WHERE CustomerID=:CustomerID`, {
            replacements: { CustomerID: CustomerID },
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
