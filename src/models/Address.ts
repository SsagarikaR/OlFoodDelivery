import { DataTypes ,Model} from "sequelize";
import {sequelize} from '../config/database'

export const Addresses=sequelize.define('Addresses',{
    AddressID:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    City:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    PINCode:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    street:{
        type:DataTypes.STRING(100),
        allowNull:false
    }
},
{
    tableName:'Addresses',
    timestamps:false
})

console.log(Addresses===sequelize.models.Addresses);

