"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const getToken = async (id) => {
    console.log(id, process.env.JWT_SECRET_KEY, process.env, "token genearate");
    const token = jwt.sign({ identifire: id }, "jsomwebtoken", { expiresIn: '30d' });
    return token;
};
exports.getToken = getToken;
