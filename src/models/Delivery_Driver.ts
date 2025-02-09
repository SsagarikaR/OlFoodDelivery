import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Users } from "./Users";
import { Addresses } from "./Address";

export const Delivery_Driver=sequelize.define('Delivery_Driver',{
    DeliveryDriverID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
   UserID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Users,
            key:'UserID'
        },
        onDelete:'CASCADE'
    },
     AddressID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:Addresses,
                key:'AddressID'
            }
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