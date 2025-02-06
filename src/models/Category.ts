import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'

export const Category=sequelize.define('Category',{
    CategoryID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    CategoryName:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},
{
 timestamps:false  
})

console.log(Category===sequelize.models.Category);