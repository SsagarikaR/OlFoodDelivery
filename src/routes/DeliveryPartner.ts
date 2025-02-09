import { checkToken } from "../config/authorization";
import { Request,Response,Router } from "express";
import { Sequelize ,QueryTypes} from "sequelize";
import { sequelize } from "../config/database";
import { forAddress } from "../Interface/interface";

const router=Router();

 router.post("/register",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    const {CustomerAddress}=req.body;
    let AddressID:number;
    try{
        const IsPartnerExist=await sequelize.query('SELECT FROM Delivery_Driver WHERE UserID=?',
            {
                replacements:[UserID],
                type:QueryTypes.SELECT
            }
        )
        if(IsPartnerExist.length>0){
            return res.status(403).json({message:"you have already registered as a delivery partner."});
        }
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
        const newPartner=await sequelize.query('INSERT INTO Delivery_Driver (  UserID, AddressID)  VALUES (?,?)')
        return res.status(202).json({message:"you have successfully registered as a delivery partner"});
    }
    catch(error){
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
 })

 router.patch("/",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    const CustomerAddress=req.body;
    let AddressID:number;
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
            const newAddress=await  sequelize.query('INSERT INTO Addresses (City,PINCode,street) VALUES (?,?,?)',
                {
                    replacements:[CustomerAddress.City,CustomerAddress.PINCode,CustomerAddress.street],
                    type:QueryTypes.INSERT
                }
            )
            console.log(newAddress,"newAddress");
            AddressID=newAddress[0];
        }
        const updatePartnerAddresID=await sequelize.query('UPDATE Delivery_Partner SET AddressID=? WHERE UserID=?',
            {
                replacements:[AddressID,UserID]
            }
        )
    }
    catch(error){

    }
 })

 router.delete("/",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    try{
        const isUserExist=await sequelize.query(`SELECT * FROM Delivery_Driver WHERE UserID=?`,
            {
                replacements:[UserID],
                type:QueryTypes.SELECT
            }
        )
        if(isUserExist.length===0){
            return res.status(404).json({message:"You haven't registered as a delivery partner"});
        }
        const deleteAccount=await sequelize.query('DELETE FROM Delivery_Driver WHERE UserID=?',
            {
                replacements:[UserID],
                type:QueryTypes.DELETE
            }
        )
        return res.status(200).json({message:"You have successfully signed out as delivery partner."});
    }
    catch(error){
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
 })