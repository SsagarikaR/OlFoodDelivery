import { checkToken } from "../config/authorization";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import { Request,Response,Router } from "express";
import { forAddress, forDeliveryAssignment } from "../Interface/interface";
import { forCustomerAddress,forCreatedOrder,forOrderItems } from "../Interface/interface";
const router=Router();

/**
 * @swagger
 * /orders/{restaurantID}/new:
 *   post:
 *     summary: Create a new order
 *     tags: [Order Routes]
 *     security:
 *       - authorization: []
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
 */
router.post("/:restaurantID/new",checkToken ,async(req:Request,res:Response):Promise<any>=>{
    const {MenuItems,CustomerAddress}=req.body;
    const {restaurantID}=req.params;
    const CustomerID=req.body.UserID.identifire;
    let AddressID:number;
    let CustomerAddressID:number;
    console.log(req.body);
    try{


        const IsAddressExist:forAddress[]=await sequelize.query(
            `SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`,
            {
                replacements:{
                    City:CustomerAddress.City,
                    PINCode:CustomerAddress.PINCode,
                    street:CustomerAddress.street
                },
                type:QueryTypes.SELECT
            }
        )
        if(IsAddressExist.length>0){
            AddressID=IsAddressExist[0].AddressID;
        }
        else{
            const result = await sequelize.query(
                `INSERT INTO Addresses (City, PINCode, street) VALUES (?, ?, ?)`,
                {
                    replacements: [CustomerAddress.City, CustomerAddress.PINCode, CustomerAddress.street],
                    type: QueryTypes.INSERT
                }
            );
            AddressID = result[0];
            console.log("New Address Created with ID:", AddressID);
        }

        const IsCustomerAdressExist:forCustomerAddress[]=await sequelize.query(
            `SELECT * FROM Customer_Address WHERE CustomerID=? AND AddressID=?`,
            {
                replacements:[CustomerID,AddressID],
                type:QueryTypes.SELECT
            }
        )
        if(IsCustomerAdressExist.length>0){
            CustomerAddressID=IsCustomerAdressExist[0].CustomerAddressID;
        }
        else{
            const result = await sequelize.query(
                `INSERT INTO Customer_Address (CustomerID, AddressID) VALUES (?, ?)`,
                {
                    replacements: [CustomerID, AddressID],
                    type: QueryTypes.INSERT
                }
            );
            CustomerAddressID = result[0];
            console.log("New Customer Address Created with ID:", CustomerAddressID);
        }


        const [result,metadata]=await sequelize.query(`INSERT into Orders (CustomerID,RestaurantID, CustomerAddressID)VALUES (?,?,?)`,
            {
                replacements:[CustomerID,restaurantID, CustomerAddressID],
                type:QueryTypes.INSERT
            }
        )
        if(metadata>0){
            const createdOrder: forCreatedOrder[] = await sequelize.query(
                'SELECT * FROM Orders WHERE CustomerID= ? ORDER BY OrderID DESC LIMIT 1',
                {
                    replacements: [CustomerID],
                    type: QueryTypes.SELECT
                }
            );
            const OrderID = createdOrder[0].OrderID;

            // Insert order items for the current order
            await sequelize.query(
                `INSERT INTO OrderItems (MenuItemID, OrderID, Quantity) VALUES ${MenuItems.map(
                    (item: { MenuItemID: number, Quantity: number }) => {
                        return `(${item.MenuItemID}, ${OrderID}, ${item.Quantity})`;
                    }
                ).join(",")}`,
                {
                    type: QueryTypes.INSERT
                }
            );

            const driver:forDeliveryAssignment[] = await sequelize.query(
                `SELECT  Delivery_Driver.DeliveryDriverID
                FROM Delivery_Driver 
                LEFT JOIN Assignments ON Delivery_Driver.DeliveryDriverID = Assignments.DeliveryDriverID 
                GROUP BY Delivery_Driver.DeliveryDriverID 
                ORDER BY COUNT(Assignments.OrderID) ASC 
                LIMIT 1`,
                { type: QueryTypes.SELECT }
            );
    
            const driverId = driver[0].DeliveryDriverID;
    
            await sequelize.query(
                `INSERT INTO Assignments (OrderID, DeliveryDriverID) VALUES (?, ?)`,
                {
                    replacements: [OrderID, driverId],
                    type: QueryTypes.INSERT
                }
            );
    
    

            // Fetch order items and calculate the total price for the current order
            const orderItems:forOrderItems[] = await sequelize.query(
                `SELECT oi.OrderItemsID, oi.Quantity, mi.ItemName, mi.ItemPrice,
                (mi.ItemPrice * oi.Quantity) AS ItemTotalPrice
                FROM OrderItems oi
                JOIN MenuItems mi ON oi.MenuItemID = mi.MenuItemID
                WHERE oi.OrderID = ?`,
                {
                    replacements: [OrderID],
                    type: QueryTypes.SELECT
                }
            );

            console.log(orderItems);
            const totalOrderPrice = orderItems.reduce((sum, item) => {
                return sum + item.ItemTotalPrice;
            }, 0);

            return res.status(200).json({
                OrderID,
                RestaurantID: restaurantID,
                OrderItems: orderItems,
                TotalPrice: totalOrderPrice,
                DeliveryPartner:driverId
            });
        }
        else{
            return res.status(409).json({message:"failed to create a order"});
        }
    }
    catch(error){
        console.log(error,"error")
        return res.status(500).json({Error:"Please try again after sometimes!!"});
    }
})



/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for a customer
 *     tags: [Order Routes]
 *     security:
 *       - authorization: []
 *     responses:
 *       200:
 *         description: Successful retrieval of orders
 *       404:
 *         description: No orders found
 *       500:
 *         description: Internal server error
 */
router.get("/",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    try{
        const allOrder=await sequelize.query(`SELECT * FROM Orders where CustomerID=?`,
            {
                replacements:[UserID],
                type:QueryTypes.SELECT
            }
        )
        if(allOrder.length>0){
            return res.status(200).json(allOrder);
        }
        else{
            return res.status(404).json({message:"You have no orders yet."});
        }
    }
    catch(error){
        console.log("error",error)
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
})


/**
 * @swagger
 * /orders/assignments/{orderId}:
 *   get:
 *     summary: Get assignment details for an order
 *     tags: [Order Routes]
 *     security:
 *       - authorization: []
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
 */
router.get("/assignments/:orderId",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const orderId=req.params;
    try{
        const yourDetail=await sequelize.query(`SELECT * FROM Assignments WHERE OrderID=?`,
            {
                replacements:[orderId],
                type:QueryTypes.SELECT
            }
        )
        return res.status(200).json(yourDetail[0]);
    }
    catch(error){
        console.log(error,"error");
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
})



/**
 * @swagger
 * /orders/{orderID}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order Routes]
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
 */
router.delete("/:orderID", async (req: Request, res: Response): Promise<any> => {
    const { orderID } = req.params;  
    try {
        const order:forCreatedOrder[]=await sequelize.query(
            `SELECT * FROM Orders WHERE OrderID = ?`,
            {
                replacements: [orderID],
                type: QueryTypes.SELECT
            }
         )
         if(order[0].status==="Success"){
            return res.status(403).json({message:"You can't delete this order now"});
         }
        const deletedOrder = await sequelize.query(
            `DELETE FROM Orders WHERE OrderID = ?`,
            {
                replacements: [orderID],
            }
        );
      
            return res.status(200).json({ message: 'Order deleted successfully.' });

    } catch (error) {
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
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - OrderItemsPrice
 *               - PlatformCharge
 *               - TotalPrice
 *               - PaymentMethod
 *               - Payment_status
 *             properties:
 *               OrderItemsPrice: { type: number }
 *               PlatformCharge: { type: number }
 *               TotalPrice: { type: number }
 *               PaymentMethod: { type: string }
 *               Payment_status: { type: string }
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/:orderId/payment", checkToken, async (req: Request, res: Response):Promise<any> => {
    const userId = req.body.UserID.identifire;
    const OrderID=req.params.orderId
    const { OrderItemsPrice, PlatformCharge, TotalPrice, PaymentMethod, Payment_status } = req.body;

    // Basic input validation
    if (!OrderID || !OrderItemsPrice || !PlatformCharge || !TotalPrice || !PaymentMethod || !Payment_status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await sequelize.query(
            `INSERT INTO Payments (OrderID,  OrderItemsPrice, PlatformCharge, TotalPrice, Payment_status, PaymentMethod) 
             VALUES (:OrderID, , :OrderItemsPrice, :PlatformCharge, :TotalPrice, :Payment_status, :PaymentMethod)`,
            {
                replacements: {
                    OrderID,
                    OrderItemsPrice,
                    PlatformCharge,
                    TotalPrice,
                    PaymentMethod,
                    Payment_status
                },
                type: QueryTypes.INSERT,
            }
        );

        const newPayment = await sequelize.query(`SELECT * FROM Payments WHERE PaymentID = ?`, 
            {
                replacements:[result[0]],
                type: QueryTypes.SELECT 
            });

        return res.status(201).json(newPayment[0]); 

    } catch (error) {
        console.error("error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});



/**
 * @swagger
 * /orders/{orderId}/payment-detail:
 *   get:
 *     summary: Get payment details for an order
 *     tags: [Order Routes]
 *     security:
 *       - authorization: []
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
 */
router.get("/:orderId/payment-details", checkToken, async (req: Request, res: Response): Promise<any> => {
    const orderId = parseInt(req.params.orderId, 10);
    const userId = req.body.UserID.identifire; 

    if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }

    try {
        const payments = await sequelize.query(
            `SELECT * FROM Payments WHERE OrderID = :orderId AND PaymentMethod = :userId`,
            {
                replacements: { orderId, userId },
                type: QueryTypes.SELECT,
            }
        );

        if (payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this order and user" });
        }

        return res.status(200).json(payments);
    } catch (error) {
        console.error("error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;