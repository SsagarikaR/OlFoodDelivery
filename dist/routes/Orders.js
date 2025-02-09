"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/:restaurantID/new", authorization_1.checkToken, async (req, res) => {
    const { MenuItems, CustomerAddress } = req.body;
    const { restaurantID } = req.params;
    const CustomerID = req.body.UserID.identifire;
    let AddressID;
    let CustomerAddressID;
    console.log(req.body);
    try {
        const IsAddressExist = await database_1.sequelize.query(`SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`, {
            replacements: {
                City: CustomerAddress.City,
                PINCode: CustomerAddress.PINCode,
                street: CustomerAddress.street
            },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsAddressExist.length > 0) {
            AddressID = IsAddressExist[0].AddressID;
        }
        else {
            const result = await database_1.sequelize.query(`INSERT INTO Addresses (City, PINCode, street) VALUES (?, ?, ?)`, {
                replacements: [CustomerAddress.City, CustomerAddress.PINCode, CustomerAddress.street],
                type: sequelize_1.QueryTypes.INSERT
            });
            AddressID = result[0];
            console.log("New Address Created with ID:", AddressID);
        }
        const IsCustomerAdressExist = await database_1.sequelize.query(`SELECT * FROM Customer_Address WHERE CustomerID=? AND AddressID=?`, {
            replacements: [CustomerID, AddressID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (IsCustomerAdressExist.length > 0) {
            CustomerAddressID = IsCustomerAdressExist[0].CustomerAddressID;
        }
        else {
            const result = await database_1.sequelize.query(`INSERT INTO Customer_Address (CustomerID, AddressID) VALUES (?, ?)`, {
                replacements: [CustomerID, AddressID],
                type: sequelize_1.QueryTypes.INSERT
            });
            CustomerAddressID = result[0];
            console.log("New Customer Address Created with ID:", CustomerAddressID);
        }
        const [result, metadata] = await database_1.sequelize.query(`INSERT into Orders (CustomerID,RestaurantID, CustomerAddressID)VALUES (?,?,?)`, {
            replacements: [CustomerID, restaurantID, CustomerAddressID],
            type: sequelize_1.QueryTypes.INSERT
        });
        if (metadata > 0) {
            const createdOrder = await database_1.sequelize.query('SELECT * FROM Orders WHERE CustomerID= ? ORDER BY OrderID DESC LIMIT 1', {
                replacements: [CustomerID],
                type: sequelize_1.QueryTypes.SELECT
            });
            const OrderID = createdOrder[0].OrderID;
            // Insert order items for the current order
            await database_1.sequelize.query(`INSERT INTO OrderItems (MenuItemID, OrderID, Quantity) VALUES ${MenuItems.map((item) => {
                return `(${item.MenuItemID}, ${OrderID}, ${item.Quantity})`;
            }).join(",")}`, {
                type: sequelize_1.QueryTypes.INSERT
            });
            const driver = await database_1.sequelize.query(`SELECT DeliveryDriverID 
                 FROM Delivery_Driver 
                 LEFT JOIN Assignments ON Delivery_Driver.DeliveryDriverID = Assignments.DeliveryDriverID 
                 GROUP BY Delivery_Driver.DeliveryDriverID 
                 ORDER BY COUNT(Assignments.OrderID) ASC 
                 LIMIT 1`, { type: sequelize_1.QueryTypes.SELECT });
            const driverId = driver[0].DeliveryDriverID;
            await database_1.sequelize.query(`INSERT INTO Assignments (OrderID, DeliveryDriverID) VALUES (?, ?)`, {
                replacements: [OrderID, driverId],
                type: sequelize_1.QueryTypes.INSERT
            });
            // Fetch order items and calculate the total price for the current order
            const orderItems = await database_1.sequelize.query(`SELECT oi.OrderItemsID, oi.Quantity, mi.ItemName, mi.ItemPrice,
                        (mi.ItemPrice * oi.Quantity) AS ItemTotalPrice
                 FROM OrderItems oi
                 JOIN MenuItems mi ON oi.MenuItemID = mi.MenuItemID
                 WHERE oi.OrderID = ?`, {
                replacements: [OrderID],
                type: sequelize_1.QueryTypes.SELECT
            });
            console.log(orderItems);
            const totalOrderPrice = orderItems.reduce((sum, item) => {
                return sum + item.ItemTotalPrice;
            }, 0);
            return res.status(200).json({
                OrderID,
                RestaurantID: restaurantID,
                OrderItems: orderItems,
                TotalPrice: totalOrderPrice,
                DeliveryPartner: driverId
            });
        }
        else {
            return res.status(409).json({ message: "failed to create a order" });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ Error: "Please try again after sometimes!!" });
    }
});
router.delete("/:orderID", async (req, res) => {
    const { orderID } = req.params;
    try {
        const order = await database_1.sequelize.query(`SELECT * FROM Orders WHERE OrderID = ?`, {
            replacements: [orderID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (order[0].status === "Success") {
            return res.status(403).json({ message: "You can't delete this order now" });
        }
        const deletedOrder = await database_1.sequelize.query(`DELETE FROM Orders WHERE OrderID = ?`, {
            replacements: [orderID],
        });
        return res.status(200).json({ message: 'Order deleted successfully.' });
    }
    catch (error) {
        console.log(error, "Error deleting order");
        return res.status(500).json({ message: 'Failed to delete the order. Please try again later.' });
    }
});
exports.default = router;
