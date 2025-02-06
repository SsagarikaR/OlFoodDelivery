import { DataTypes ,Model} from "sequelize";
import {sequelize} from '../config/database'

export const Address=sequelize.define('Address',{
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
    tableName:'Address',
    timestamps:false
})

console.log(Address===sequelize.models.Address);

