import { DataTypes } from "sequelize";
import {sequelize} from '../config/database'
import { Address } from "./Address";
import { Users } from "./Users";

export const Customer_Address=sequelize.define('Customer_Address',{
    CustomerAddressID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    CustomerID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Users,
            key:'CustomerID'
        },
        onDelete:'CASCADE'
    },
    AddressID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Address,
            key:'AddressID'
        }
    }
},
{
 tableName:'Customer_Address',
 timestamps:false  
})

console.log(Customer_Address===sequelize.models.Customer_Address);