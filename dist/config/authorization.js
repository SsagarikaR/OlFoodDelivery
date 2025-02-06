"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(201).json({ message: "Token Not Found in header" });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    console.log("tokennn ", token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "jsomwebtoken");
        req.body.customerID = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Token Not Found" });
    }
};
exports.checkToken = checkToken;
