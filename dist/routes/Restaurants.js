"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const express_1 = require("express");
const Restaurant_1 = require("../models/Restaurant");
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Restaurant Routes
 *   description: API related to restaurant management
 */
/**
 * @swagger
 * /restaurants/register:
 *   post:
 *     summary: Register a new restaurant
 *     tags: [Restaurant Routes]
 *     description: Allows a user to register a new restaurant.
 *     security:
 *       - authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - City
 *               - PINCode
 *               - street
 *               - RestaurantName
 *               - RestaurantContactNo
 *             properties:
 *               City:
 *                 type: string
 *               PINCode:
 *                 type: string
 *               street:
 *                 type: string
 *               RestaurantName:
 *                 type: string
 *               RestaurantContactNo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant registered successfully.
 *       409:
 *         description: Restaurant already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", authorization_1.checkToken, async (req, res) => {
    const OwnerID = req.body.UserID.identifire;
    const { City, PINCode, street, RestaurantName, RestaurantContactNo } = req.body;
    // console.log(req.body)
    let AddressID;
    try {
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`, {
            replacements: {
                City: City,
                PINCode: PINCode,
                street: street
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        // console.log(OwnerID);
        // console.log(IsAddressExist);
        if (IsAddressExist.length > 0) {
            AddressID = IsAddressExist[0].AddressID;
        }
        else {
            const newAddress = await database_1.sequelize.query('INSERT INTO Addresses (City,PINCode,street) VALUES (?,?,?)', {
                replacements: [City, PINCode, street],
                type: sequelize_1.QueryTypes.INSERT
            });
            console.log(newAddress, "newAddress");
            AddressID = newAddress[0];
        }
        // console.log(AddressID);
        const IsRestaurantExist = await database_1.sequelize.query(`SELECT * FROM Restaurant WHERE 
           RestaurantName=:RestaurantName AND 
           RestaurantContactNo=:RestaurantContactNo AND 
           AddressID=:AddressID AND OwnerID=:OwnerID`, {
            replacements: {
                RestaurantName: RestaurantName,
                RestaurantContactNo: RestaurantContactNo,
                AddressID: AddressID,
                OwnerID: OwnerID
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        console.log(IsRestaurantExist, "IsRestaurantExist");
        if (IsRestaurantExist.length > 0) {
            return res.json({ Message: "This restaurant is already registered" });
        }
        const newRestaurant = await Restaurant_1.Restaurant.create({ RestaurantName: RestaurantName, RestaurantContactNo: RestaurantContactNo, AddressID: AddressID, OwnerID: OwnerID });
        // console.log(newRestaurant,"newRestaurant");
        return res.json(newRestaurant);
    }
    catch (error) {
        // console.error("Error:", error); 
        return res.status(500).json({ Error: "Please try again after some times" });
    }
});
/**
 * @swagger
 * /restaurants/{id}/categories/new:
 *   post:
 *     summary: Add a new menu category to a restaurant
 *     tags: [Category Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CategoryName
 *             properties:
 *               CategoryName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       409:
 *         description: Category already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/:id/categories/new", authorization_1.checkToken, async (req, res) => {
    const { CategoryName } = req.body;
    const { id } = req.params;
    console.log(CategoryName, "categoryName", id, "id");
    try {
        //CHECK WHETHER THE CATEGORY LREADY EXIST
        const isCategoryExist = await database_1.sequelize.query('SELECT * FROM Categories WHERE CategoryName=? AND RestaurantID=?', {
            replacements: [CategoryName, id],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (isCategoryExist.length > 0) {
            return res.status(409).json({ Message: "This category already exists" });
        }
        const [result, metadata] = await database_1.sequelize.query(`INSERT INTO Categories (CategoryName,RestaurantID) VALUES (?,?)`, {
            replacements: [CategoryName, id],
            type: sequelize_1.QueryTypes.INSERT
        });
        console.log(result, metadata, "InsertCategory");
        if (metadata > 0) {
            const insertedCategory = await database_1.sequelize.query('SELECT * FROM Categories WHERE CategoryName=? AND RestaurantID=?', {
                replacements: [CategoryName, id],
                type: sequelize_1.QueryTypes.SELECT
            });
            console.log(insertedCategory, "insertedCategory");
            return res.status(201).json(insertedCategory);
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Message: "Please try again after sometimes" });
    }
});
/**
 * @swagger
 * /restaurants/{id}/categories:
 *   delete:
 *     summary: Delete a menu category from a restaurant
 *     tags: [Category Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CategoryID
 *             properties:
 *               CategoryID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       404:  # Or 400 Bad Request if the category ID is invalid
 *         description: Category doesn't exist.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id/categories", authorization_1.checkToken, async (req, res) => {
    const { id } = req.params;
    const { CategoryID } = req.body;
    try {
        const deleteCategory = await database_1.sequelize.query(`SELECT * FROM Categories WHERE CategoryID=:CategoryID`, {
            replacements: { CategoryID: CategoryID },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (deleteCategory.length === 0) {
            return res.json({ message: "Category doesn't exist" });
        }
        const [result, metadata] = await database_1.sequelize.query('DELETE FROM Categories WHERE CategoryID=? ', {
            replacements: [CategoryID]
        });
        console.log(result, "result", metadata, "metadata");
        return res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try again after sometimes" });
    }
});
/**
 * @swagger
 * /restaurants/{id}/categories:
 *   get:
 *     summary: Retrieve menu categories of a restaurant
 *     tags: [Restaurant Routes]
 *     description: Fetch all menu categories for a given restaurant ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of menu categories.
 *       404:
 *         description: No menu category found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id/categories", async (req, res) => {
    const { id } = req.params;
    try {
        const menuCategory = await database_1.sequelize.query('SELECT * FROM Categories WHERE RestaurantID=?', {
            replacements: [id]
        });
        if (menuCategory[0].length > 0) {
            return res.status(200).json(menuCategory[0]);
        }
        else {
            return res.status(404).json({ Message: "No menu category exist." });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try again after sometimes!!" });
    }
});
/**
 * @swagger
 * /restaurants/{id}/menu-items/new:
 *   post:
 *     summary: Add a new menu item to a restaurant
 *     tags: [Menu Item Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ItemName
 *               - ItemPrice
 *               - CategoryID
 *             properties:
 *               ItemName:
 *                 type: string
 *               ItemPrice:
 *                 type: number
 *               CategoryID:
 *                 type: integer
 *               Thumbnail:
 *                 type: string
 *               discount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Menu item created successfully.
 *       409:
 *         description: Menu item already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/:id/menu-items/new", async (req, res) => {
    const { id } = req.params;
    const { ItemName, ItemPrice, CategoryID, Thumbnail, discount } = req.body;
    try {
        const IsItemExist = await database_1.sequelize.query(`SELECT * FROM MenuItems WHERE ItemName=? AND CategoryID=?`, {
            replacements: [ItemName, CategoryID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsItemExist.length > 0) {
            return res.status(409).json({ Message: "This item already exist" });
        }
        const [result, metadata] = await database_1.sequelize.query(`INSERT INTO MenuItems (ItemName,ItemPrice,CategoryID,RestaurantID,Thumbnail,discount)
                                                       VALUES (?,?,?,?,?,?)`, {
            replacements: [ItemName, ItemPrice, CategoryID, id, Thumbnail ? Thumbnail : null, discount ? discount : null],
            type: sequelize_1.QueryTypes.INSERT
        });
        if (metadata > 0) {
            const CreatedMenu = await database_1.sequelize.query(`SELECT * FROM MenuItems WHERE ItemName=? AND CategoryID=?`, {
                replacements: [ItemName, CategoryID],
                type: sequelize_1.QueryTypes.SELECT
            });
            return res.status(201).json(CreatedMenu);
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try gain after sometimes." });
    }
});
/**
 * @swagger
 * /restaurants/menu-items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu Item Routes]
 *     responses:
 *       200:
 *         description: Successful retrieval of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'  # Reference the MenuItem schema
 *       409:
 *         description: No menu items found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 */
router.get("/menu-items", async (req, res) => {
    try {
        const menuItems = await database_1.sequelize.query(`SELECT * FROM MenuItems`, {
            type: sequelize_1.QueryTypes.SELECT
        });
        if (menuItems.length > 0) {
            return res.status(200).json(menuItems);
        }
        else {
            return res.status(409).json({ Message: "No item found" });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).send({ Error: "Please try again after sometimes!!" });
    }
});
/**
 * @swagger
 * /restaurants/menu-items/{name}/{price}:
 *   get:
 *     summary: Get menu items by name and price
 *     tags: [Menu Item Routes]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the menu item
 *       - in: path
 *         name: price
 *         schema:
 *           type: number  # Or integer if price is an integer
 *         required: true
 *         description: The price of the menu item
 *     responses:
 *       200: # Changed to 200 OK for successful retrieval
 *         description: Successful retrieval of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       404:  # Changed to 404 Not Found if no items are found
 *         description: No menu items found with the given name and price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 */
router.get("/menu-items/:name/:price", async (req, res) => {
    const { name, price } = req.params;
    // const {ItemName,ItemPrice}=req.body;
    console.log(req.params);
    try {
        const items = await database_1.sequelize.query(`SELECT * FROM MenuItems WHERE ItemName=? AND ItemPrice=?`, {
            replacements: [name, price]
        });
        if (items[0].length > 0) {
            return res.status(409).json(items[0]);
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try gain after sometimes." });
    }
});
/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Retrieve all restaurants
 *     tags: [Restaurant Routes]
 *     description: Fetch a list of all registered restaurants.
 *     responses:
 *       200:
 *         description: A list of restaurants.
 *       404:
 *         description: No restaurant found.
 *       500:
 *         description: Internal server error.
 */
router.get("/", async (req, res) => {
    try {
        const AllRestaurants = await database_1.sequelize.query(`SELECT * FROM Restaurant`);
        if (AllRestaurants[0].length < 1) {
            return res.json({ Message: "No restaurant exist" });
        }
        return res.json(AllRestaurants[0]);
    }
    catch (error) {
        return res.json({ Error: "Please try again after some times!!" });
    }
});
exports.default = router;
