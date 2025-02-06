import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Address } from "./Address";
import { Users} from "./Users";

export const Restaurant=sequelize.define('Restaurant',{
    RestaurantID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    RestaurantName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    RestaurantContactNo:{
        type:DataTypes.STRING(15),
        allowNull:false,
    },
    AddressID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Address,
            key:'AddressID'
        }
    },
    OwnerID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Users,
            key:'UserID'
        },
        onDelete:'CASCADE'
    },
    Rating:{
        type:DataTypes.INTEGER
    }
},
{
    tableName:"Restaurant",
    timestamps:false
})

console.log( Restaurant===sequelize.models.Restaurant);