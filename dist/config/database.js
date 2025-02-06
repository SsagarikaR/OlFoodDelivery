"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('olFoodDelivery', 'sagarika', 'Sagarika@%71', {
    host: 'localhost',
    dialect: 'mysql',
});
try {
    exports.sequelize.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
// (async()=>{
//  console.log( await sequelize.sync({alter:true}));
// })();
exports.sequelize.sync().then((data) => {
    console.log("database synced successfully");
    // console.log(data);
}).catch((error) => {
    console.log("Error syncing databse:", error);
});
