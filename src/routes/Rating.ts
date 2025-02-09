import { Request,Response,Router } from "express";
import { Sequelize,QueryTypes } from "sequelize";
import { sequelize } from "../config/database";
import { checkToken } from "../config/authorization";

const router=Router();

/**
 * @swagger
 * /reviews/delivery-partners/{driverId}:
 *   post:
 *     summary: Add a rating for a delivery partner
 *     tags: [Rating Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: integer # Or string, depending on your driverId type
 *         required: true
 *         description: The ID of the delivery driver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: The rating given to the driver (e.g., 1-5)
 *     responses:
 *       202:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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



 /**
 * @swagger
 * /reviews/delivery-partners/{driverId}:
 *   get:
 *     summary: Get all ratings for a delivery partner
 *     tags: [Rating Routes]
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: integer # Or string
 *         required: true
 *         description: The ID of the delivery driver
 *     responses:
 *       200:
 *         description: Successful retrieval of ratings
 *       500:
 *         description: Internal server error
 */
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



/**
 * @swagger
 * /reviews/restaurant/{restaurantId}:
 *   post:
 *     summary: Add a rating for a restaurant
 *     tags: [Rating Routes]
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer # Or string
 *         required: true
 *         description: The ID of the restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: The rating given to the restaurant
 *     responses:
 *       202:
 *         description: Rating added successfully
 *       500:
 *         description: Internal server error
 */
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


 
/**
 * @swagger
 * /reviews/restauarnts/{restaurantId}:
 *   get:
 *     summary: Get all ratings for a restaurant
 *     tags: [Rating Routes]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         schema:
 *           type: integer # Or string
 *         required: true
 *         description: The ID of the restaurant
 *     responses:
 *       200:
 *         description: Successful retrieval of ratings
 *       500:
 *         description: Internal server error
 */
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