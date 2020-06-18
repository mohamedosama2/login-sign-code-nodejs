const express=require('express');
const nodemailer=require('nodemailer')
const nodeTransport=require('nodemailer-sendgrid-transport')
const crypto=require('crypto');
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser')
const morgan=require('morgan');
const User=require('./models/user');
const  mongoose  = require('mongoose');
const jwt=require('jsonwebtoken');
const keys=require('./config/keys');
const app=express();


app.use(morgan('dev'))
app.use(bodyParser.json())


mongoose.Promise=global.Promise;
mongoose.connect(keys.mongo_uri)
.then(()=>{
    console.log('connected');
});



app.post('/otp/send',async(req,res,next)=>{
    try{
    var token;
    const email=req.body.email;
    const existed=await User.findOne({email})
    if(existed){
      return   res.status(400).json({
            message:'email used '
        })
    }

    crypto.randomBytes(4,(err,buffer)=>{
        if(err){
            res.status(400).json({
                message:'err'
            })
        }
        token=buffer.toString('hex');
        const transporter=nodemailer.createTransport(nodeTransport({
            auth:{ api_key:keys.email_key}
       }))
   
       transporter.sendMail({
           to:email,
           from:'latokalatohamato@gmail.com',
           subject:'hello',
           html:`<h1>  registered successfully yaa 3m</h1>
                <h4> the verfy code is  ${token}  </h4> `
       })
   
       const user=new User({
           email,
           verify_code:token
       })
       user.save()
       res.status(201).json({
        result:"successfully verfy your email",
        email:email
    })
    }) 
}
catch(error){
    throw error
}
})


app.post('/otp/verify',async(req,res,next)=>{
    const token=req.body.verify_code;
    const email=req.body.email;
    const user=await User.findOne({email,verify_code:token})
    if(!user){
       return res.status(404).json({
            message:"not founded ya mlkt"
        })
    }
    
    user.confirmed= "true"
    await user.save()
    res.status(200).json({
        message:"the email confirmed successfully ya 3aaam"
    })

})

app.post('/signup',async(req,res,next)=>{
    try{
    const email=req.body.email;
    const nameAr=req.body.nameAr;
    const nameEn=req.body.nameEn;
    const password=req.body.password;

    const user =await User.findOne({email,confirmed:true});
    if(!user){
        return res.status(404).json({
            message:"the email hasn't confirmed yet pleasse confirm"
        })
    }
    const accessToken=jwt.sign({
        sub:user.id,
    },'secret',{expiresIn:'1h'})

    const hashed=await bcrypt.hash(password,12)
    user.nameAr=nameAr;
    user.nameEn=nameEn;
    user.password=hashed;
    await user.save();
    res.status(201).json({
        token:accessToken,
        message:"user is created ya man",
        email:email,
        
    })
}
catch(error){
    throw error
}
})


app.post('/signin',async(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const user=await User.findOne({email,confirmed:true});
    if(!user){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
    const doMathch=await bcrypt.compare(password,user.password);
    if(!doMathch){
        return res.status(400).json({
            message:"the password not correct"
        })
    }
    const accessToken=jwt.sign({
        sub:user.id,
    },'secret',{expiresIn:'1h'})

    res.status(200).json({
        message:"sucess",
        token:accessToken
    })
}
catch(error){
    throw error
}
})


app.post('/forget-password/send',async(req,res,next)=>{
    try{
    const email=req.body.email;
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
    var token;
    crypto.randomBytes(4,(err,buffer)=>{
        if(err){
           return res.status(400).json({
                message:'err'
            })
        }
        token=buffer.toString('hex');
        console.log(token)
        const transporter=nodemailer.createTransport(nodeTransport({
            auth:{ api_key:'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'}
       }))
    
       transporter.sendMail({
           to:email,
           from:'latokalatohamato@gmail.com',
           subject:'hello',
           html:`<h1>  forgeting password</h1>
                <h4> the verfy code is  ${token}  </h4> `
       })
       console.log(token)
       user.confirmed=false;
       user.verify_code=token;
       user.save()
       res.status(200).json({
           message:"check your mail for the verfy code"
       })

    })
}
catch(error){
    throw error
}
})


app.post('/forget-password/verify',async(req,res,next)=>{
    try{
    const email=req.body.email;
    const verify_code=req.body.verify_code;
    const password=req.body.password;
    const user=await User.findOne({email,verify_code,confirmed:"false"})
    if(!user){
            return res.status(404).json({
                message:"the email is not founded"
            })
    }
    const hashed=await bcrypt.hash(password,12)
    user.password=hashed;
    user.confirmed=true;
    await user.save();
    res.status(200).json({
        message:"sucees the password has reset"
    })
}
catch(error){
    throw error
}
})



app.post('/change-password',async(req,res,next)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const newPassword=req.body.newPassword;

    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"the email is not founded"
        })
    }
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
    throw error
}
})


app.listen(process.env.PORT||8080,()=>{
 console.log('ruun')
})
