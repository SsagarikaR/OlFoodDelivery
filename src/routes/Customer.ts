import { sequelize } from "../config/database";
import {Router,Request,Response} from "express"
import bcrypt from "bcrypt";
import { promises } from "dns";
import { JSON, QueryTypes } from "sequelize";
import { Users } from "../models/Users";
import { getToken } from "../config/authentication";
import { json } from "body-parser";
import { checkToken } from "../config/authorization";
interface forNewUser{
    CustomerID: number,
    CustomerName: string,
    CustomerEmail: string,
    CustomerContactNo: string,
    password?: string,
    token?:string
}

const router=Router();

router.post("/register", async (req: Request, res: Response): Promise<any> => {
    const { CustomerName, CustomerEmail, CustomerContactNo, password } = req.body;
    try {
        const IsExistName=await sequelize.query('SELECT * from Users where CustomerName=:CustomerName',
            {
                replacements:{CustomerName:CustomerName},
                type:QueryTypes.SELECT
            }
        )
        console.log(IsExistName,"CustomerName");
        if(IsExistName.length>0){
            return res.json({message:"A user with this name already exist"});
        }

        const IsExistEmail=await sequelize.query('SELECT * from Users where CustomerEmail=:CustomerEmail',
            {
                replacements:{CustomerEmail:CustomerEmail},
                type:QueryTypes.SELECT
            }
        )

        console.log(IsExistEmail,"CustomerName");
        if(IsExistEmail.length>0){
            return res.json({message:"This email is already registered"});
        }
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creating new User
        const newUser=await Users.create({CustomerName: CustomerName, CustomerEmail: CustomerEmail, CustomerContactNo:CustomerContactNo,password: hashedPassword})

        //Creating token and returning it to the User
        const token=await getToken(newUser.dataValues.CustomerID);
        console.log("Customer added: ", newUser);
        const userToReturn=newUser.toJSON();
        userToReturn.token=token;
        delete userToReturn.password;
        return res.json(userToReturn);
    } catch (error) {
        console.error(error);
        return res.json({ error: "Please try again" });
    }
});


router.post("/login",async(req:Request,res:Response):Promise<any>=>{
    const {CustomerName, CustomerEmail, CustomerContactNo, password}=req.body;
    
    try{
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user:forNewUser[]=await sequelize.query('SELECT * from Users where CustomerName=:CustomerName AND customerEmail=:CustomerEmail AND  CustomerContactNo=:CustomerContactNo',
            {
                replacements:{
                                CustomerName:CustomerName,
                                CustomerEmail:CustomerEmail,
                                CustomerContactNo:CustomerContactNo,
                                LIMIT:1
                            },
                type:QueryTypes.SELECT
            }
        )
        if(user.length<1){
           return res.send({message:"user doesn't exist"});
        }
        if(user[0].password){
            const isPasswordValid=await bcrypt.compare(password,user[0].password);
            if(!isPasswordValid){
                return res.json({message:"invalid pssword"});
            }   
        } 
        console.log(user,"logged in user");
        const userToReturn=user[0]
        console.log(userToReturn,"userToReturn");
        const token=await getToken(user[0].CustomerID)
        userToReturn.token=token;
        delete userToReturn.password;
        return res.json(userToReturn);
    }
    catch(error){
        return res.status(500).json({ error: "Please try again" });
    }
})


router.delete("/close",checkToken,async(req:Request,res:Response):Promise<any>=>{
    // console.log(req.body);
    const CustomerID=req.body.customerID.identifire
    console.log(CustomerID,"customerID")
    try{
        const deleteUser=await sequelize.query(
            `SELECT * FROM Users WHERE CustomerID=:CustomerID`,
            {
                replacements:{CustomerID:CustomerID},
                type:QueryTypes.SELECT
            }
        )
        if(deleteUser.length===0){
            return res.json({message:"User doesn't exist"});
        }
        const deleteAccount=await sequelize.query(
            `DELETE FROM Users where CustomerID=:CustomerID`,
            {
                replacements:{CustomerID:CustomerID},
                type:QueryTypes.DELETE
            }
        )
        return res.json({message:"Account deleted successfully"});
        // console.log(deleteAccount);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
    }
})

router.patch("/password/change",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const CustomerID=req.body.customerID.identifire
    const {password}=req.body;
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const updatePassword=await sequelize.query(
            `UPDATE Users SET password=:password WHERE CustomerID=:CustomerID`,
            {
                replacements:{
                    CustomerID:CustomerID,
                    password:hashedPassword
                }
            }
        )
        const updatedUser=await sequelize.query(
            `SELECT * FROM Users WHERE CustomerID=:CustomerID`,
            {
                replacements:{CustomerID:CustomerID},
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
    const CustomerID=req.body.customerID.identifire
    try{
        console.log("customers data");
        const Users=await sequelize.query(
        `SELECT * from Users WHERE CustomerID=:CustomerID`,{
            replacements:{CustomerID:CustomerID},
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