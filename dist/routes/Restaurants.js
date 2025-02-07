"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const express_1 = require("express");
const Address_1 = require("../models/Address");
const Restaurant_1 = require("../models/Restaurant");
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
//REGISTER YOU RESTAURANT
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
            const newAddress = await Address_1.Addresses.create({ City: City, PINCode: PINCode, street: street });
            console.log(newAddress, "newAddress");
            AddressID = newAddress.dataValues.AddressID;
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
//ADD NEW MENU CATEGORY
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
//DELETE CATEGORY
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
//RETRIEVE MENU CATEGORY OF A RESTAURANT
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
//ADD MENU ITEMS
router.post("/:id/menu-items/new", async (req, res) => {
    const { id } = req.params;
    const { ItemName, ItemPrice, CategoryID, Thumbnail, discount } = req.body;
    try {
        const IsItemExist = await database_1.sequelize.query(`SELECT * FROM MenuItems WHERE ItemName= ? AND CategoryID= ?`, {
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
            const CreatedMenu = await database_1.sequelize.query(`SELECT * FROM MenuItems WHERE ItemName=? AND CategoryID=?`);
            return res.status(201).json(CreatedMenu);
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try gain after sometimes." });
    }
});
//GET ALL MENU ITEMS
router.get("/menu-items", async (req, res) => {
    try {
        const menuItems = await database_1.sequelize.query(`SELECT * FROM MenuItems`, {
            type: sequelize_1.QueryTypes.SELECT
        });
        if (menuItems.length > 0) {
            return res.status(200).json(menuItems[0]);
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
//GET MENU ITEMS BY PRICE AND NAME
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
//GET ALL THE RESTAURANTS
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
