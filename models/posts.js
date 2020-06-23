const mongoose=require('mongoose');
const Schema=mongoose.Schema;
autoIncrement = require('mongoose-auto-increment');
require('dotenv').config()


const postSchema=new Schema({
    comments:[
        {
        text:{
            type:String
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    }
    ],
    likes:[
        {
        number:{
            type:Number
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    text:{
        type:String,
        required:true
    }

})


module.exports=mongoose.model('posts',postSchema);