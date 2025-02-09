"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const authorization_1 = require("../config/authorization");
const router = (0, express_1.Router)();
router.post("/delivery-partners/:driverId", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const driverId = req.params;
    const { rating } = req.body;
    try {
        const addRating = await database_1.sequelize.query('INSERT INTO RatingDriver (CustomerID, DeliveryDriverID,Rating) VALUES (?,?,?)', {
            replacements: [UserID, driverId, rating],
            type: sequelize_1.QueryTypes.INSERT
        });
        const [ratings] = await database_1.sequelize.query('SELECT AVG(Rating) AS averageRating FROM RatingDriver WHERE DeliveryDriverID = ?', { replacements: [driverId], type: sequelize_1.QueryTypes.SELECT });
        const averageRating = ratings.averageRating;
        await database_1.sequelize.query('UPDATE Delivery_Driver SET Rating = ? WHERE DeliveryDriverID = ?', { replacements: [averageRating, driverId], type: sequelize_1.QueryTypes.UPDATE });
        console.log(addRating);
        return res.status(202).json({ message: "You have successfully added review" });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
router.get("/delivery-partners/:driverId", async (req, res) => {
    const driverId = req.params;
    try {
        const getallRating = await database_1.sequelize.query('SELECT * FROM RatingDriver WHERE DeliveryDriverID=?', {
            replacements: [driverId],
            type: sequelize_1.QueryTypes.SELECT
        });
        return res.status(200).json(getallRating);
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again after sometimes" });
    }
});
router.post("/restaurant/:restaurantId", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const RestaurantID = req.params;
    const { rating } = req.body;
    try {
        const addRating = await database_1.sequelize.query('INSERT INTO RatingRestaurants (CustomerID,  RestaurantID,Rating) VALUES (?,?,?)', {
            replacements: [UserID, RestaurantID, rating],
            type: sequelize_1.QueryTypes.INSERT
        });
        // Calculate the average rating for the restaurant
        const [ratings] = await database_1.sequelize.query('SELECT AVG(Rating) AS averageRating FROM RatingRestaurants WHERE RestaurantID = ?', { replacements: [RestaurantID], type: sequelize_1.QueryTypes.SELECT });
        const averageRating = ratings.averageRating;
        await database_1.sequelize.query('UPDATE Restaurant SET Rating = ? WHERE RestaurantID = ?', { replacements: [averageRating, RestaurantID], type: sequelize_1.QueryTypes.UPDATE });
        console.log(addRating);
        return res.status(202).json({ message: "You have successfully added review" });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
router.get("/restauarnts/:restaurantId", async (req, res) => {
    const restaurantId = req.params;
    try {
        const getallRating = await database_1.sequelize.query('SELECT * FROM RatingRestaurants WHERE RestaurantID=?', {
            replacements: [restaurantId],
            type: sequelize_1.QueryTypes.SELECT
        });
        return res.status(200).json(getallRating);
    }
    catch (error) {
        return res.status(500).json({ error: "Please try again after sometimes" });
    }
});
exports.default = router;
