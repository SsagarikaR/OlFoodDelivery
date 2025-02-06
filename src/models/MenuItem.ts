import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Category } from "./Category";

export const MenuItems=sequelize.define('MenuItems',{
    MenuItemID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    ItemName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    ItemPrice:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    CategoryID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Category,
            key:'CategoryID'
        }
    }
},
{
 timestamps:false  
})

console.log(MenuItems===sequelize.models.MenuItems);