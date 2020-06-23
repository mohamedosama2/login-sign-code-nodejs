const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
email:{
        type:String,
        required:true,
        unique:true},
password:{
    type:String
},
nameAr:{
    type:String
},
nameEn:{
    type:String
},
followers:[
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    }
],
image:{
    type:String
},
rule:{
    type:String,
    default:'normal'
}
})
module.exports=mongoose.model('user',userSchema)