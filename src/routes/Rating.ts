import { Request,Response,Router } from "express";
import { Sequelize,QueryTypes } from "sequelize";
import { sequelize } from "../config/database";
import { checkToken } from "../config/authorization";

const router=Router();

router.post("/delivery-partners/:driverId",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    const driverId=req.params;
    const {rating}=req.body;
    try{
        const addRating=await sequelize.query('INSERT INTO RatingDriver (CustomerID, DeliveryDriverID,Rating) VALUES (?,?,?)',
            {
                replacements:[UserID,driverId,rating],
                type:QueryTypes.INSERT
            }
        );
        const [ratings]:{averageRating:number}[] = await sequelize.query(
            'SELECT AVG(Rating) AS averageRating FROM RatingDriver WHERE DeliveryDriverID = ?',
            { replacements: [driverId], type: QueryTypes.SELECT }
        );

        const averageRating = ratings.averageRating;

        await sequelize.query(
            'UPDATE Delivery_Driver SET Rating = ? WHERE DeliveryDriverID = ?',
            { replacements: [averageRating, driverId], type: QueryTypes.UPDATE }
        );
        console.log(addRating);
        return res.status(202).json({message:"You have successfully added review"});
    }
    catch(error){
        console.log(error,"error")
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
 })

 router.get("/delivery-partners/:driverId",async(req:Request,res:Response):Promise<any>=>{
    const driverId=req.params;
    try{
        const getallRating=await sequelize.query('SELECT * FROM RatingDriver WHERE DeliveryDriverID=?',
            {
                replacements:[driverId],
                type:QueryTypes.SELECT
            }
        )
        return res.status(200).json(getallRating);
    }
    catch(error){
        return res.status(500).json({error:"Please try again after sometimes"});
    }
 })

 router.post("/restaurant/:restaurantId",checkToken,async(req:Request,res:Response):Promise<any>=>{
    const UserID=req.body.UserID.identifire;
    const  RestaurantID=req.params;
    const {rating}=req.body;
    try{
        const addRating=await sequelize.query('INSERT INTO RatingRestaurants (CustomerID,  RestaurantID,Rating) VALUES (?,?,?)',
            {
                replacements:[UserID,RestaurantID,rating],
                type:QueryTypes.INSERT
            }
        );
        // Calculate the average rating for the restaurant
        const [ratings]:{averageRating:number}[] = await sequelize.query(
            'SELECT AVG(Rating) AS averageRating FROM RatingRestaurants WHERE RestaurantID = ?',
            { replacements: [RestaurantID], type: QueryTypes.SELECT }
        );

        const averageRating = ratings.averageRating;

        await sequelize.query(
            'UPDATE Restaurant SET Rating = ? WHERE RestaurantID = ?',
            { replacements: [averageRating,RestaurantID], type: QueryTypes.UPDATE }
        );
        console.log(addRating);
        return res.status(202).json({message:"You have successfully added review"});
    }
    catch(error){
        console.log(error,"error")
        return res.status(500).json({error:"Please try again after sometimes!!"});
    }
 })

 router.get("/restauarnts/:restaurantId",async(req:Request,res:Response):Promise<any>=>{
    const restaurantId=req.params;
    try{
        const getallRating=await sequelize.query('SELECT * FROM RatingRestaurants WHERE RestaurantID=?',
            {
                replacements:[restaurantId],
                type:QueryTypes.SELECT
            }
        )
        return res.status(200).json(getallRating);
    }
    catch(error){
        return res.status(500).json({error:"Please try again after sometimes"});
    }
 })

 export default router;