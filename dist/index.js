"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const Customer_1 = __importDefault(require("./routes/Customer"));
const Restaurants_1 = __importDefault(require("./routes/Restaurants"));
const Orders_1 = __importDefault(require("./routes/Orders"));
const Rating_1 = __importDefault(require("./routes/Rating"));
const DeliveryPartner_1 = __importDefault(require("./routes/DeliveryPartner"));
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
(0, swaggerConfig_1.default)(app);
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
(async () => {
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
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});
app.use("/auth", auth_1.default);
app.use("/users", Customer_1.default);
app.use("/restaurants", Restaurants_1.default);
app.use("/orders", Orders_1.default);
app.use("/reviews", Rating_1.default);
app.use("/delivery-partners", DeliveryPartner_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
