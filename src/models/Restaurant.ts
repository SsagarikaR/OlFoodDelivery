import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Addresses} from "./Address";
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
        type:DataTypes.STRING,
        allowNull:false,
    },
    AddressID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Addresses,
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
    },
    Thumbnail:{
        type:DataTypes.STRING
    }
},
{
    tableName:"Restaurant",
    timestamps:false
})

console.log( Restaurant===sequelize.models.Restaurant);