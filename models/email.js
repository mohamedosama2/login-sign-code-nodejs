const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const emailSchema=new Schema({
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
        default:false
    }
})
module.exports=mongoose.model('email',emailSchema);


