import { checkToken } from "../config/authorization";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import { Request,Response,Router } from "express";
import { Addresses } from "../models/Address";
import { OrderItems } from "../models/OrderItems";

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

const router=Router();

router.post("/:restaurantID/new",checkToken ,async(req:Request,res:Response):Promise<any>=>{
    const {MenuItems,CustomerAddress}=req.body;
    const {restaurantID}=req.params;
    const CustomerID=req.body.UserID.identifire;
    let AddressID:number;
    let CustomerAddressID:number;
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
            const newAddress=await Addresses.create({City:CustomerAddress.City,PINCode:CustomerAddress.PINCode,street:CustomerAddress.street});
            console.log(newAddress,"newAddress");
            AddressID=newAddress.dataValues.AddressID;
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
            const newCustomerAddress=await CustomerAddress.create({CustomerID:CustomerID,AddressID:AddressID});
            console.log(newCustomerAddress,"newAddress");
            CustomerAddressID=newCustomerAddress.dataValues.AddressID;
        }


        const [result,metadata]=await sequelize.query(`INSERT into Orders (CustomerID,RestaurantID)VALUES (?,?)`,
            {
                replacements:[CustomerID,restaurantID],
                type:QueryTypes.INSERT
            }
        )
        if(metadata>0){
            const CreateOrderItem=await OrderItems.bulkCreate(MenuItems);
            console.log(CreateOrderItem);
            const createdOrder=await sequelize.query('SELECT * FROM Orders WHERE CustomerID= ?',
                {
                    replacements:[CustomerID],
                    type:QueryTypes.SELECT
                }
            )
            return res.status(500).json(createdOrder);
        }
    }
    catch(error){
        console.log(error,"error")
        return res.status(500).json({Error:"Please try again after sometimes!!"});
    }
})

export default router;