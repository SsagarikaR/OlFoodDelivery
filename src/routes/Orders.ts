import { checkToken } from "../config/authorization";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import { Request,Response,Router } from "express";
import { Addresses } from "../models/Address";
import { OrderItems } from "../models/OrderItems";
import { Customer_Address } from "../models/CustomerAdress";

interface forAddress{
    AddressID:number,
    City:string,
    PINCode:string,
    street:string
}

interface forCustomerAddress{
    CustomerAddressID:number,
    CustomerID:number,
    AddressID:number
}

interface forCreatedOrder{
    OrderID:number,
    CustomerID:number,
    RestaurantID:number,
    CustomerAddressID:number,
    OrderDate:Date,
    status:string
}

interface forOrderItems{
    "OrderItemsID": number,
    "Quantity": number,
    "ItemName": string,
    "ItemPrice": number,
    "ItemTotalPrice": number
}

const router=Router();

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
            // console.log(CreateOrderItem);
            const totalOrderPrice = orderItems.reduce((sum, item) => {
                return sum + item.ItemTotalPrice; // Sum of item prices
            }, 0);

            // Add total order price to the response
            return res.status(200).json({
                OrderID,
                RestaurantID: restaurantID,
                OrderItems: orderItems,
                TotalPrice: totalOrderPrice
            });
        }
    }
    catch(error){
        console.log(error,"error")
        return res.status(500).json({Error:"Please try again after sometimes!!"});
    }
})



router.delete("/:orderID", async (req: Request, res: Response): Promise<any> => {
    const { orderID } = req.params;  // Get OrderID from the URL parameters

    try {
        // 1. Delete related items in OrderItems (if needed)
        await sequelize.query(
            `DELETE FROM OrderItems WHERE OrderID = ?`,
            {
                replacements: [orderID],
                type: QueryTypes.DELETE
            }
        );
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
export default router;