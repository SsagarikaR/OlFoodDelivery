import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
// import mysql from "mysql";
import { Address } from './models/Address';
import "./config/database"
import customerAPIs from "./routes/Customer"
import restaurantAPIs from "./routes/Restaurants";
import { Users} from './models/Users';
import { Customer_Address } from './models/CustomerAdress';
import { Restaurant } from './models/Restaurant';
import { Category } from './models/Category';
import { MenuItems } from './models/MenuItem';
import { Orders } from './models/Orders';
import { OrderItems } from './models/OrderItems';
import { RatingRestaurants } from './models/RatingRestaurant';
import { RatingDriver } from './models/RatingDriver';
import { Payments } from './models/Payments';
import { Assignments } from './models/Assignments';
import { Delivery_Driver } from './models/Delivery_Driver';
import { sequelize } from './config/database';

const app = express();
const port =  3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

(async()=>{
    await Address.sync();
    await Users.sync();
    await Customer_Address.sync();
    await Restaurant.sync({alter:true});
    await Category.sync();
    await MenuItems.sync();
    await Orders.sync();
    await OrderItems.sync();
    await RatingRestaurants.sync();
    await RatingDriver.sync();
    await Payments.sync();
    await Assignments.sync();
    await Delivery_Driver.sync();
    // await sequelize.sync({alter:true});
    // console.log("table synced")
  })();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});


app.use("/customers",customerAPIs);
app.use("/restaurants",restaurantAPIs);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});