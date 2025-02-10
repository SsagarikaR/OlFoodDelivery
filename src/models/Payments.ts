import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Orders } from "./Orders";
import { Users} from "./Users";

export const Payments=sequelize.define('Payments',{
    PaymentID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    PaymentMethod:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:Users,
            key:'UserID'
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
    OrderItemsPrice:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    PlatformCharge:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    TotalPrice:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    Payment_status:{
        type:DataTypes.STRING,
        defaultValue:'pending'
    },
    Payment_Date:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
},
{
 timestamps:false  
})

console.log(Payments===sequelize.models.Payments);