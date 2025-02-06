import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Orders } from "./Orders";
import { Delivery_Driver } from "./Delivery_Driver";

export const Assignments=sequelize.define('Assignments',{
    AssignmentID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    OrderID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Orders,
            key:'OrderID'
        }
    },
    DeliveryDriverID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Delivery_Driver,
            key:'DeliveryDriverID'
        }
    }
},
{
    timestamps:false
})

console.log( Assignments===sequelize.models.Assignments);