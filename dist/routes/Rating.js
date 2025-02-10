"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const authorization_1 = require("../config/authorization");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /reviews/delivery-partners/{driverId}:
 *   post:
 *     summary: Add a rating for a delivery partner
 *     tags: [Rating Routes]
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT  # Optionally specify the format if you're using JWT tokens
 *     security:
 *       - bearerAuth: []  # This ensures that the endpoint requires the bearerAuth security
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: integer  # Or string, depending on your driverId type
 *         required: true
 *         description: The ID of the delivery driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: The rating given to the driver (e.g., 1-5)
 *     responses:
 *       202:
 *         description: Rating added successfully
 *       404:
 *         description: Delivery partner doesn't exist
 *       500:
 *         description: Internal server error
 */
router.post("/delivery-partners/:driverId", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const { driverId } = req.params;
    const { rating } = req.body;
    try {
        const IsdriverExist = await database_1.sequelize.query(`SELECT * FROM Delivery_Driver WHERE DeliveryDriverID=?`, {
            replacements: [driverId],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsdriverExist.length === 0) {
            return res.status(404).json({ message: "This delivery partner doesn't exist" });
        }
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
/**
* @swagger
* /reviews/delivery-partners/{driverId}:
*   get:
*     summary: Get all ratings for a delivery partner
*     tags: [Rating Routes]
*     parameters:
*       - in: path
*         name: driverId
*         schema:
*           type: integer # Or string
*         required: true
*         description: The ID of the delivery driver
*     responses:
*       200:
*         description: Successful retrieval of ratings
*       404:
*         description: Driver  not found or no rating for driver
*       500:
*         description: Internal server error
*/
router.get("/delivery-partners/:driverId", async (req, res) => {
    const { driverId } = req.params;
    try {
        const IsdriverExist = await database_1.sequelize.query(`SELECT * FROM Delivery_Driver WHERE DeliveryDriverID=?`, {
            replacements: [driverId],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsdriverExist.length === 0) {
            return res.status(404).json({ message: "This delivery partner doesn't exist" });
        }
        const getallRating = await database_1.sequelize.query('SELECT * FROM RatingDriver WHERE DeliveryDriverID=?', {
            replacements: [driverId],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (getallRating.length > 0) {
            return res.status(200).json(getallRating);
        }
        else {
            return res.status(404).json({ message: "This delivery partner has no ratings yet." });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Please try again after sometimes" });
    }
});
/**
 * @swagger
 * /reviews/restaurant/{restaurantId}:
 *   post:
 *     summary: Add a rating for a restaurant
 *     tags: [Rating Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer # Or string
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: The rating given to the restaurant
 *     responses:
 *       202:
 *         description: Rating added successfully
 *       500:
 *         description: Internal server error
 */
router.post("/restaurant/:restaurantId", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    const RestaurantID = req.params.restaurantId;
    const { rating } = req.body;
    console.log(UserID, RestaurantID, rating);
    try {
        const IsRatingExist = await database_1.sequelize.query('SELECT * FROM RatingRestaurants WHERE RestaurantID=? AND CustomerID=?', {
            replacements: [RestaurantID, UserID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsRatingExist.length === 0) {
            return res.status(403).json({ message: `You have already added review for this restaurant` });
        }
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
/**
 * @swagger
 * /reviews/restauarnts/{restaurantId}:
 *   get:
 *     summary: Get all ratings for a restaurant
 *     tags: [Rating Routes]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer # Or string
 *         required: true
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: Successful retrieval of ratings
 *       404:
 *         description: This restaurant  doesn't exist
 *       500:
 *         description: Internal server error
 */
router.get("/restauarnts/:restaurantId", async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const IsRestaurantExist = await database_1.sequelize.query(`SELECT * FROM Restaurant WHERE RestaurantID=?`, {
            replacements: [restaurantId],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsRestaurantExist.length === 0) {
            return res.status(404).json({ message: "This restaurant  doesn't exist" });
        }
        const getallRating = await database_1.sequelize.query('SELECT * FROM RatingRestaurants WHERE RestaurantID=?', {
            replacements: [restaurantId],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (getallRating.length > 0) {
            return res.status(200).json(getallRating);
        }
        else {
            return res.status(404).json({ message: "This restaurant has no ratings yet." });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Please try again after sometimes" });
    }
});
exports.default = router;
