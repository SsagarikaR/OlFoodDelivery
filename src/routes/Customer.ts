import { sequelize } from "../config/database";
import {Router,Request,Response} from "express"
import bcrypt from "bcryptjs";
import {  QueryTypes } from "sequelize";
import { Users } from "../models/Users";
import { getToken } from "../config/authentication";
import { checkToken } from "../config/authorization";
import { forNewUser } from "Interface/interface";

const router=Router();

router.delete("/",checkToken,async(req:Request,res:Response):Promise<any>=>{
    // console.log(req.body);
    const UserID=req.body.UserID.identifire
    console.log(UserID,"customerID")
    try{
        const deleteUser=await sequelize.query(
            `SELECT * FROM Users WHERE UserID=:UserID`,
            {
                replacements:{UserID:UserID},
                type:QueryTypes.SELECT
            }
        )
        if(deleteUser.length===0){
            return res.json({message:"User doesn't exist"});
        }
        const deleteAccount=await sequelize.query(
            `DELETE FROM Users where UserID=:UserID`,
            {
                replacements:{UserID:UserID},
                type:QueryTypes.DELETE
            }
        )
        return res.status(204).json({Message:"Account deleted successfully"});
        // console.log(deleteAccount);
    }
    catch(error){
        return res.json({Error:"Please try again after some times"});
    }
})



router.patch("/password/change",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire
    const {password}=req.body;
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const updatePassword=await sequelize.query(
            `UPDATE Users SET password=:password WHERE UserID=:UserID`,
            {
                replacements:{
                    UserID:UserID,
                    password:hashedPassword
                }
            }
        )
        const updatedUser=await sequelize.query(
            `SELECT * FROM Users WHERE UserID=:UserID`,
            {
                replacements:{UserID:UserID},
                type:QueryTypes.SELECT
            }
        )
        console.log(updatedUser);
       return res.json({message:"password updated successfully"});
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
})

router.get("/",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire
    console.log(req.body);
    console.log(UserID);
    try{
        console.log("customers data");
        const Users=await sequelize.query(
        `SELECT * from Users WHERE UserID=:UserID`,{
            replacements:{UserID:UserID},
            type:QueryTypes.SELECT
        })
        console.log(Users);
        return res.json(Users);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
   
});

router.get("/all",async(req:Request,res:Response):Promise<any>=>{
    try{
        console.log("customers data");
        const Users=await sequelize.query(
        `SELECT * from Users `,{
            type:QueryTypes.SELECT
        })
        console.log(Users);
        return res.json(Users);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
   
});

export default router;