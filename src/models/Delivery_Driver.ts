import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'

export const Delivery_Driver=sequelize.define('Delivery_Driver',{
    DeliveryDriverID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    DeliveryDriverName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    DeliveryDriverContact:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    DeliveryDriverEmail:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Rating:{
        type:DataTypes.INTEGER
    }
},
{
 tableName:'Delivery_Driver',
 timestamps:false  
})

console.log(Delivery_Driver===sequelize.models.Delivery_Driver);