import {DataTypes, Model} from 'sequelize'
import { db } from '../dbconnection/db_index'

interface Comment {
    user_name:string,
    At:string,
    comment:string
}

interface Likes{
    user_name:string
}

interface Posts {
    title:string,
    by:string,
    posted_At:string,
    article:string,
    no_of_comments:number,
    comments: Comment[],
    no_of_likes: number,
    likes: Likes[]
}

export type IUSER = {
    id:string,
    userName:string,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    city:string,
    state:string,
    zip:string,
    country:string,
    verification:boolean,
    role:string,
    posts: Posts[]
}

class User extends Model<IUSER>{}

User.init({
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    userName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull:true
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull:true
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    city:{
        type: DataTypes.STRING,
        allowNull:true
    },
    state:{
        type: DataTypes.STRING,
        allowNull:true
    },
    zip:{
        type: DataTypes.STRING,
        allowNull:true
    },
    country:{
        type: DataTypes.STRING,
        allowNull:true
    },
    verification:{
        type: DataTypes.BOOLEAN,
        allowNull:true
    },
    role:{
        type: DataTypes.STRING,
        allowNull:false
    },
    posts:{
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true     
    },
}, {
    sequelize: db,
    tableName: "User",
    modelName: "User"
})

export default User











