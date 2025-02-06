import { checkToken } from "../config/authorization";
import { sequelize } from "../config/database";
import { Router,Request,Response } from "express";
import { Address } from "../models/Address";
import { Restaurant } from "../models/Restaurant";
import { QueryTypes } from "sequelize";

interface forAddress{
    AddressID:number,
    City:string,
    PINCode:string,
    street:string
}

const router=Router();

router.post("/register",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const OwnerID=req.body.UserID.identifire;
    const {City,PINCode,street,RestaurantName,RestaurantContactNo}=req.body
    // console.log(req.body)
    let addressID:number;
    try{
        const IsAddressExist:forAddress[]=await sequelize.query(
            `SELECT * FROM Address WHERE City=:City AND PINCode=:PINCode AND street=:street`,
            {
                replacements:{
                    City:City,
                    PINCode:PINCode,
                    street:street
                },
                type:QueryTypes.SELECT
            }
        )
        console.log(IsAddressExist);
        if(IsAddressExist.length>0){
            addressID=IsAddressExist[0].AddressID;
        }
        else{
            const newAddress=await Address.create({City:City,PINCode:PINCode,street:street});
            console.log(newAddress,"newAddress");
            addressID=newAddress.dataValues.AddressID;
        }
        console.log(addressID);
        const newRestaurant=await Restaurant.create({RestaurantName:RestaurantName,RestaurantContactNo:RestaurantContactNo,AddressID:addressID,OwnerID:OwnerID})
        console.log(newRestaurant,"newRestaurant");
        return res.json(newRestaurant);
    }
    catch(error){
        return res.status(500).json({error:"Please try again after some times"});
    }
})

router.get("/",async(req:Request,res:Response):Promise<any>=>{
    try{
        const AllRestaurants=await sequelize.query(
            `SELECT * FROM Restaurant`
        )
        if(AllRestaurants.length<1){
            return res.json({message:"No restaurant exist"});
        }
        return res.json(AllRestaurants);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
})
export default router;