"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../config/authorization");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const express_1 = require("express");
const router = (0, express_1.Router)();
const IsOrderBelongToYou = async (req, res, next) => {
    const UserID = req.body.UserID.identifire;
    const { orderId } = req.params;
    try {
        const restaurant = await database_1.sequelize.query('SELECT * FROM Orders WHERE OrderID = ? AND CustomerID = ?', {
            replacements: [orderId, UserID],
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (restaurant.length === 0) {
            return res.status(403).json({ message: "You are not authorized to access the  details of this order." });
        }
        next();
    }
    catch (error) {
        console.log("Error ", error);
        return res.status(500).json({ message: "Please try again after sometimes" });
    }
};
/**
 * @swagger
 * /orders/{restaurantID}/new:
 *   post:
 *     summary: Create a new order
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []  # This ensures that the endpoint requires the bearerAuth security
 *     parameters:
 *       - in: path
 *         name: restaurantID
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
 *               - MenuItems
 *               - CustomerAddress
 *             properties:
 *               MenuItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     MenuItemID: { type: integer }
 *                     Quantity: { type: integer }
 *               CustomerAddress:
 *                 type: object
 *                 properties:
 *                   City: { type: string }
 *                   PINCode: { type: string }
 *                   street: { type: string }
 *     responses:
 *       200:
 *         description: Order created successfully
 *       409:
 *         description: Failed to create order
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
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
            const driver = await database_1.sequelize.query(` SELECT  Delivery_Driver.DeliveryDriverID
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
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of orders
 *       404:
 *         description: No orders found
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.get("/", authorization_1.checkToken, async (req, res) => {
    const UserID = req.body.UserID.identifire;
    try {
        const allOrder = await database_1.sequelize.query(`SELECT * FROM Orders where CustomerID=?`, {
            replacements: [UserID],
            type: sequelize_1.QueryTypes.SELECT
        });
        if (allOrder.length > 0) {
            return res.status(200).json(allOrder);
        }
        else {
            return res.status(404).json({ message: "You have no orders yet." });
        }
    }
    catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
/**
 * @swagger
 * /orders/assignments/{orderId}:
 *   get:
 *     summary: Get assignment details for an order
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Successful retrieval of assignment details
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.get("/assignments/:orderId", authorization_1.checkToken, IsOrderBelongToYou, async (req, res) => {
    const orderId = req.params;
    try {
        const yourDetail = await database_1.sequelize.query(`SELECT * FROM Assignments WHERE OrderID=?`, {
            replacements: [orderId],
            type: sequelize_1.QueryTypes.SELECT
        });
        return res.status(200).json(yourDetail[0]);
    }
    catch (error) {
        console.log(error, "error");
        return res.status(500).json({ error: "Please try again after sometimes!!" });
    }
});
/**
 * @swagger
 * /orders/{orderID}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       403:
 *         description: Order cannot be deleted (e.g., already processed)
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.delete("/:orderID", authorization_1.checkToken, IsOrderBelongToYou, async (req, res) => {
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
/**
 * @swagger
 * /orders/{orderId}/payment:
 *   post:
 *     summary: Process payment for an order
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *       - in: header
 *         name:  Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional - JWT token from local storage (alternative to Authorization header)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - PaymentMethod
 *             properties:
 *               OrderItemsPrice: { type: number }
 *               PaymentMethod: { type: string }
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.post("/:orderId/payment", authorization_1.checkToken, IsOrderBelongToYou, async (req, res) => {
    const userId = req.body.UserID.identifire;
    const OrderID = req.params.orderId;
    const { OrderItemsPrice, PaymentMethod } = req.body;
    const PlatformCharge = 10;
    const TotalPrice = OrderItemsPrice + PlatformCharge;
    if (!OrderID || !OrderItemsPrice || !PaymentMethod) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = await database_1.sequelize.query(`INSERT INTO Payments (OrderID,  OrderItemsPrice, PlatformCharge, TotalPrice, Payment_status, PaymentMethod) 
             VALUES (:OrderID,  :OrderItemsPrice, :PlatformCharge, :TotalPrice, 'Success', :PaymentMethod)`, {
            replacements: {
                OrderID,
                OrderItemsPrice,
                PlatformCharge,
                TotalPrice,
                PaymentMethod,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        const newPayment = await database_1.sequelize.query(`SELECT * FROM Payments WHERE PaymentID = ?`, {
            replacements: [result[0]],
            type: sequelize_1.QueryTypes.SELECT
        });
        return res.status(201).json(newPayment[0]);
    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ error: "Please try again after sometimes" });
    }
});
/**
 * @swagger
 * /orders/{orderId}/payment-details:
 *   get:
 *     summary: Get payment details for an order
 *     tags: [Order Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Successful retrieval of payment details
 *       404:
 *         description: No payments found
 *       500:
 *         description: Internal server error
 *     securityDefinitions:
 *       authorization:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 *         description: "JWT Token required for authentication"
 */
router.get("/:orderId/payment-details", authorization_1.checkToken, IsOrderBelongToYou, async (req, res) => {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.body.UserID.identifire;
    if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }
    try {
        const payments = await database_1.sequelize.query(`SELECT * FROM Payments WHERE OrderID = :orderId AND PaymentMethod = :userId`, {
            replacements: { orderId, userId },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this order " });
        }
        return res.status(200).json(payments);
    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ error: "Please try again after sometimes." });
    }
});
exports.default = router;
