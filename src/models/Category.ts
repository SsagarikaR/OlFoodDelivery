import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Restaurant } from "./Restaurant";

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
    },
      RestaurantID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:Restaurant,
                key:'RestaurantID'
            },
            onDelete:'CASCADE'
        }
},
{
 timestamps:false  
})

console.log(Category===sequelize.models.Category);