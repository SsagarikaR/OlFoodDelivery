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
    UserID: number,
    UserName: string,
    UserEmail: string,
    UserContactNo: string,
    password?: string,
    token?:string
}

const router=Router();

router.post("/register", async (req: Request, res: Response): Promise<any> => {
    const { UserName, UserEmail, UserContactNo, password } = req.body;
    try {
        const IsExistName=await sequelize.query('SELECT * from Users where UserName=:UserName',
            {
                replacements:{UserName:UserName},
                type:QueryTypes.SELECT
            }
        )
        console.log(IsExistName,"UserName");
        if(IsExistName.length>0){
            return res.json({message:"A user with this name already exist"});
        }

        const IsExistEmail=await sequelize.query('SELECT * from Users where UserEmail=:UserEmail',
            {
                replacements:{UserEmail:UserEmail},
                type:QueryTypes.SELECT
            }
        )

        console.log(IsExistEmail,"UserName");
        if(IsExistEmail.length>0){
            return res.json({message:"This email is already registered"});
        }
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creating new User
        const newUser=await Users.create({UserName: UserName, UserEmail: UserEmail, UserContactNo:UserContactNo,password: hashedPassword})

        //Creating token and returning it to the User
        console.log(newUser);
        const token=await getToken(newUser.dataValues.UserID);
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
    const {UserName,UserEmail, UserContactNo, password}=req.body;
    
    try{
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user:forNewUser[]=await sequelize.query('SELECT * from Users where UserName=:UserName AND UserEmail=:UserEmail AND  UserContactNo=:UserContactNo',
            {
                replacements:{
                                UserName:UserName,
                                UserEmail:UserEmail,
                                UserContactNo:UserContactNo,
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
        const token=await getToken(user[0].UserID)
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
        return res.json({message:"Account deleted successfully"});
        // console.log(deleteAccount);
    }
    catch(error){
        return res.json({error:"Please try again after some times"});
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

export default router;