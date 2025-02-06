require("dotenv").config();
const jwt=require("jsonwebtoken");
export const getToken=async(id:number)=>{
    console.log(id,process.env.JWT_SECRET_KEY,"token genearate");
    const token=jwt.sign(
        {identifire:id},
        "jsomwebtoken",
        {expiresIn:'30d'}
    );
    return token;
}