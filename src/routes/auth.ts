import {sequelize } from "../config/database";
import {Router,Request,Response} from "express"
import bcrypt from "bcryptjs";
import {  QueryTypes } from "sequelize";
import { Users } from "../models/Users";
import { getToken } from "../config/authentication";

import { forNewUser } from "Interface/interface";

const router=Router();

/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: API for user signup and signin
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User Authentication]
 *     description: Creates a new user account if the username and email are not already taken.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserName
 *               - UserEmail
 *               - UserContactNo
 *               - password
 *             properties:
 *               UserName:
 *                 type: string
 *               UserEmail:
 *                 type: string
 *               UserContactNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
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
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser=await sequelize.query('INSERT INTO Users (UserName, UserEmail, UserContactNo,password) VALUES (?,?,?,?)',
            {
                replacements:[UserName,UserEmail,UserContactNo,hashedPassword],
                type:QueryTypes.INSERT
            }
        )
        console.log(newUser);
        const token=await getToken(newUser[0]);
        return res.json(token);
    } catch (error) {
        console.error(error);
        return res.json({ error: "Please try again" });
    }
});



/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate user
 *     tags: [User Authentication]
 *     description: Logs in a user if credentials match an existing account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserName
 *               - UserEmail
 *               - UserContactNo
 *               - password
 *             properties:
 *               UserName:
 *                 type: string
 *               UserEmail:
 *                 type: string
 *               UserContactNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post("/signin",async(req:Request,res:Response):Promise<any>=>{
    const {UserName,UserEmail, UserContactNo, password}=req.body;
    
    try{
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