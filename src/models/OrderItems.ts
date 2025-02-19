import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { MenuItems } from "./MenuItem";
import { Orders } from "./Orders";

export const OrderItems=sequelize.define('OrderItems',{
    OrderItemsID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    MenuItemID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:MenuItems,
            key:'MenuItemID'
        },
        onDelete:'CASCADE'
    },
    OrderID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Orders,
            key:'OrderID'
        },
        onDelete:'CASCADE'
    },
    Quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
},
{
 timestamps:false  
})

console.log(OrderItems===sequelize.models.OrderItems);