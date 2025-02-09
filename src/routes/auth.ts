import {sequelize } from "../config/database";
import {Router,Request,Response} from "express"
import bcrypt from "bcryptjs";
import {  QueryTypes } from "sequelize";
import { Users } from "../models/Users";
import { getToken } from "../config/authentication";

import { forNewUser } from "Interface/interface";

const router=Router();

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
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


router.post("/signin",async(req:Request,res:Response):Promise<any>=>{
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

export default router;