const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    verify_code:{
        type:String
    },
    confirmed:{
        type:Boolean,
        default:'false'
    },
    password:{
        type:String
    },
    nameAr:{
        type:String
    },
    nameEn:{
        type:String
    },

})
module.exports=mongoose.model('users',userSchema);