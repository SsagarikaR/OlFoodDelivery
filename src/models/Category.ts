import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Restaurant } from "./Restaurant";

export const Categories=sequelize.define('Categories',{
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
    },
    Thumbnail:{
        type:DataTypes.STRING
    }
},
{
 timestamps:false  
})

console.log(Categories===sequelize.models.Categories);