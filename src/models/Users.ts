import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'

export const Users=sequelize.define('Users',{
    CustomerID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    CustomerName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    CustomerEmail:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    CustomerContactNo:{
        type:DataTypes.STRING(15),
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
    timestamps:false
})

console.log(Users===sequelize.models.Users);