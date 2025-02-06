import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Users } from "./Users";
import { Restaurant } from "./Restaurant";

export const RatingRestaurants=sequelize.define('RatingRestaurants',{
    RatingRestaurantID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    RestaurantID:{
        type:DataTypes.INTEGER,
        references:{
            model:Restaurant,
            key:'RestaurantID'
        }
    },
    Rating:{
        type:DataTypes.INTEGER,
    },
    CustomerID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Users,
            key:'UserID'
        },
        onDelete:'CASCADE'
    },
   
},
{
 timestamps:false  
})

console.log(RatingRestaurants===sequelize.models.RatingRestaurants);