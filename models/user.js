const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const emailSchema=new Schema({
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
}
})
module.exports=mongoose.model('user',emailSchema)