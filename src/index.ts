import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import "./config/database"
import authAPIs from "./routes/auth";
import customerAPIs from "./routes/Customer"
import restaurantAPIs from "./routes/Restaurants";
import orderAPIs from "./routes/Orders";
import reviewAPIS from "./routes/Rating";
import deliveryPartnerAPIs from "./routes/DeliveryPartner"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';

import { Users} from './models/Users';
import { Customer_Address } from './models/CustomerAdress';
import { Restaurant } from './models/Restaurant';
import { Categories } from './models/Category';
import { MenuItems } from './models/MenuItem';
import { Orders } from './models/Orders';
import { OrderItems } from './models/OrderItems';
import { RatingRestaurants } from './models/RatingRestaurant';
import { RatingDriver } from './models/RatingDriver';
import { Payments } from './models/Payments';
import { Assignments } from './models/Assignments';
import { Delivery_Driver } from './models/Delivery_Driver';
import { Addresses } from './models/Address';
import { title } from 'process';
import { version } from 'os';

const app = express();
const port =  3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

swaggerDocs(app);
// const swaggerOptions={
//     definition:{
//         openapi:"3.0.0",
//         info:{
//             title:"API for online food delivery app",
//             version:"1.0.0",
//             description:"API for online food delivery app"
//         },
//         servers:[
//             {
//                 url:"http://localhost:3000"
//             }
//         ]
//     },
//     apis:["./routes/*.js"],
// };

// const swaggerSpec=swaggerJSDoc(swaggerOptions);
// app.use("/api-docs",swaggerUi.serve,(req:Request,res:Response)=>{
//     console.log(swaggerSpec);
//     swaggerUi.setup(swaggerSpec);

// }
// );

(async()=>{
    // await Addresses.sync({alter:true});
    // await Users.sync({alter:true});
    // await Customer_Address.sync({alter:true});
    // await Restaurant.sync({alter:true});
    // await Categories.sync({alter:true});
    // await MenuItems.sync({alter:true});
    // await Orders.sync({alter:true});
    // await OrderItems.sync({alter:true});
    // await RatingRestaurants.sync({alter:true});
    // await RatingDriver.sync({alter:true});
    // await Payments.sync({alter:true});
    // await Assignments.sync({alter:true});
    // await Delivery_Driver.sync({alter:true});
})();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});


app.use("/auth",authAPIs)
app.use("/users",customerAPIs);
app.use("/restaurants",restaurantAPIs);
app.use("/orders",orderAPIs)
app.use("/reviews",reviewAPIS);
app.use("/delivery-partners",deliveryPartnerAPIs);

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});