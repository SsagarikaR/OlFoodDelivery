import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Category } from "./Category";
import { Restaurant } from "./Restaurant";
import { Users} from "./Users";

export const Orders=sequelize.define('Orders',{
    OrderID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
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
    RestaurantID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Restaurant,
            key:'RestaurantID'
        },
        onDelete:'CASCADE'
    },
    OrderDate:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:'pending'
    }
},
{
 timestamps:false  
})

console.log(Orders===sequelize.models.Orders);