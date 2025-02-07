import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Categories } from "./Category";
import { Restaurant } from "./Restaurant";

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
            model:Categories,
            key:'CategoryID'
        },
        onDelete:'CASCADE'
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
    discount:{
        type:DataTypes.INTEGER
    },
    Thumbnail:{
        type:DataTypes.STRING
        
    }
},
{
 timestamps:false  
})

console.log(MenuItems===sequelize.models.MenuItems);