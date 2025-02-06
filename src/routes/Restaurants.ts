import { checkToken } from "../config/authorization";
import { sequelize } from "../config/database";
import { Router,Request,Response } from "express";
import {Addresses} from "../models/Address";
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
    let AddressID:number;
    try{
        const IsAddressExist:forAddress[]=await sequelize.query(
            `SELECT * FROM Addresses WHERE City=:City AND PINCode=:PINCode AND street=:street`,
            {
                replacements:{
                    City:City,
                    PINCode:PINCode,
                    street:street
                },
                type:QueryTypes.SELECT
            }
        )
        // console.log(OwnerID);
        // console.log(IsAddressExist);
        
        if(IsAddressExist.length>0){
            AddressID=IsAddressExist[0].AddressID;
        }
        else{
            const newAddress=await Addresses.create({City:City,PINCode:PINCode,street:street});
            console.log(newAddress,"newAddress");
            AddressID=newAddress.dataValues.AddressID;
        }
        // console.log(AddressID);

        const IsRestaurantExist=await sequelize.query(
           `SELECT * FROM Restaurant WHERE 
           RestaurantName=:RestaurantName AND 
           RestaurantContactNo=:RestaurantContactNo AND 
           AddressID=:AddressID AND OwnerID=:OwnerID`,
           {
            replacements:{
                            RestaurantName:RestaurantName,
                            RestaurantContactNo:RestaurantContactNo,
                            AddressID:AddressID,
                            OwnerID:OwnerID
                        },
            type:QueryTypes.SELECT
           }
        )
        console.log(IsRestaurantExist,"IsRestaurantExist")
        if(IsRestaurantExist.length>0){
            return res.json({message:"This restaurant is already registered"})
        }
        const newRestaurant=await Restaurant.create({RestaurantName: RestaurantName,RestaurantContactNo: RestaurantContactNo,AddressID: AddressID,OwnerID: OwnerID})
        // console.log(newRestaurant,"newRestaurant");
        return res.json(newRestaurant);
    }
    catch(error){
        // console.error("Error:", error); 
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
        return res.json(AllRestaurants[0]);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
})
export default router;