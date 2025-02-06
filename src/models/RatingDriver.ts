import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Users } from "./Users";
import { Delivery_Driver } from "./Delivery_Driver";

export const RatingDriver=sequelize.define('RatingDriver',{
    RatingRestaurantID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    Rating:{
        type:DataTypes.INTEGER,
    },
    DeliveryDriverID:{
        type:DataTypes.INTEGER,
        references:{
            model:Delivery_Driver,
            key:'DeliveryDriverID'
        }
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

console.log(RatingDriver===sequelize.models.RatingDriver);