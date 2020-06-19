
const User=require('../models/user');
const Email=require('../models/email');
const nodemailer=require('nodemailer')
const nodeTransport=require('nodemailer-sendgrid-transport')
const bcrypt=require('bcryptjs');
var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();
const jwt=require('jsonwebtoken');
require('dotenv').config()




exports.otpSend =async(req,res,next)=>{
    try{
    const email=req.body.email;
    const existed=await Email.findOne({email})
    if(existed){
      return   res.status(400).json({
            message:'email used '
        })
    }
    const token = generator.generateCodes("#+#+#", 100)[0];
    const transporter=nodemailer.createTransport(nodeTransport({
            auth:{ api_key:process.env.email_key}
       }))
   
       transporter.sendMail({
           to:email,
           from:'latokalatohamato@gmail.com',
           subject:'hello',
           html:`<h1>  registered successfully yaa 3m</h1>
                <h4> the verfy code is  ${token}  </h4> `
       })
   
       const email1=new Email({
           email,
           verify_code:token
       })
       await email1.save()
       res.status(201).json({
        result:"successfully verfy your email",
        email:email
    })
    }
catch(error){
     res.status(500).json({error})
}
}


exports.otpVerify=async(req,res,next)=>{
    try{
    const verify_code=req.body.verify_code;
    const email=req.body.email;
    const email1=await Email.findOne({email,verify_code})
    if(!email1){
       return res.status(404).json({
            message:"not founded ya mlkt"
        })
    }
    
    email1.confirmed= true
    await email1.save()
    res.status(200).json({
        message:"the email confirmed successfully ya 3aaam"
    })
}
catch(err){
    res.status(500).json({err})
}
}


exports.signUp= async(req,res,next)=>{
    try{
    const email=req.body.email;
    const nameAr=req.body.nameAr;
    const nameEn=req.body.nameEn;
    const password=req.body.password;

    const email1 =await Email.findOne({email,confirmed:true});
    if(!email1){
        return res.status(404).json({
            message:"the email hasn't confirmed yet pleasse confirm"
        })
    }
    const accessToken=jwt.sign({
        sub:email1.id,
    },process.env.keyy,{expiresIn:'1h'})

    const hashed=await bcrypt.hash(password,12)

    const user=new User({
    email:email,
    nameAr:nameAr,
    nameEn:nameEn,
    password:hashed
    })
    await user.save();
    res.status(201).json({
        token:accessToken,
        message:"user is created ya man",
        email:email,
    })
}
catch(error){
     res.status(500).json({error})
}
}


exports.signIn= async(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const email1=await Email.findOne({email,confirmed:true});
    if(!email1){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
    const user=await User.findOne({email})
    const doMathch=await bcrypt.compare(password,user.password);
    if(!doMathch){
        return res.status(400).json({
            message:"the password not correct"
        })
    }
    const accessToken=jwt.sign({
        sub:user.id,
    },process.env.keyy,{expiresIn:'1h'})

    res.status(200).json({
        message:"sucess",
        token:accessToken
    })
}
catch(error){
     res.status(500).json({error})
}}


exports.forgetSend= async(req,res,next)=>{
    try{
    const email=req.body.email;
    const email1=await Email.findOne({email});
    if(!email1){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
    const token = generator.generateCodes("#+#+#", 100)[0];

        console.log(token)
        const transporter=nodemailer.createTransport(nodeTransport({
            auth:{ api_key:process.env.email_key}
       }))
    
       transporter.sendMail({
           to:email,
           from:'latokalatohamato@gmail.com',
           subject:'hello',
           html:`<h1>  forgeting password</h1>
                <h4> the verfy code is  ${token}  </h4> `
       })
       email1.confirmed=false;
       email1.verify_code=token;
       email1.save()
       res.status(200).json({
           message:"check your mail for the verfy code"
       })

}
catch(error){
     res.status(500).json({error})
}
}


exports.forgetVerify= async(req,res,next)=>{
    try{
    const email=req.body.email;
    const verify_code=req.body.verify_code;
    const password=req.body.password;
    const email1=await Email.findOne({email,verify_code,confirmed:false})
    if(!email1){
            return res.status(404).json({
                message:"the email is not founded"
            })
    }
    const user=await User.findOne({email})
    const hashed=await bcrypt.hash(password,12)
    user.password=hashed;
    user.confirmed=true;
    await user.save();
    res.status(200).json({
        message:"sucees the password has reset"
    })
}
catch(error){
     res.status(500).json({error})
}
}


exports.changePassword= async(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const newPassword=req.body.newPassword;

    const email1=await Email.findOne({email})
    if(!email1){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
    const user=await User.findOne({email})
    const doMathch=await bcrypt.compare(password,user.password)
    if(!doMathch){
        return res.status(400).json({
            message:"the password not correct"
        })
    }
    const hashed=await bcrypt.hash(newPassword,12)
    user.password=hashed;
    await user.save();
    res.status(200).json({
        message:"password has changed successfully"
    });
}
catch(error){
     res.status(500).json({error})
}
}


