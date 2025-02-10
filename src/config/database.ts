
import { Sequelize } from 'sequelize';

export const sequelize=new Sequelize('olFoodDelivery','sagarika','Sagarika@%71',{
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}
// (async()=>{
//  console.log( await sequelize.sync({alter:true}));
// })();
  
sequelize.sync().then((data) => {
  console.log("database synced successfully");
  // console.log(data);
}).catch((error)=>{
  console.log("Error syncing databse:",error);
});
