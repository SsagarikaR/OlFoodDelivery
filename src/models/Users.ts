import { DataTypes } from "sequelize";
import {sequelize} from '../config/database';

export const Users=sequelize.define('Users',{
    UserID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    UserName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    UserEmail:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    UserContactNo:{
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