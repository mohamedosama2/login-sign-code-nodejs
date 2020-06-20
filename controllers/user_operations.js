const User=require('../models/user');


exports.getUsers=async(req,res,next)=>{
    try{
    const users=await User.find()
    if(!users){
       return res.status(404).json({
            message:"not found users"
        })
    }
    res.status(200).json({
        message:"sucess fetch the users",
        users
    })
}
catch(error){
    res.status(500).json({error})
}
}

exports.getProfile=async(req,res,next)=>{
    try{
    const user=await User.findById(req.user._id)
    if(!user){
        return res.status(404).json({
            message:"not found "
        })
    }
    if(user.id.toString()!==req.user.id.toString()){
        return res.status(401).json({
             message:"not authorized"
         })
      }
    res.status(200).json({
        message:"sucess fetching the users",
        user
    })
}
catch(error){
    res.status(500).json({error})
}
}


exports.getUser=async(req,res,next)=>{
    try{
    const userId=req.params.userId;
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:"not found"
        })
    }
    res.status(200).json({
        message:"fetched successfully",
        user
    })
}
catch(error){
    res.status(500).json({error})
}
}


exports.editUser=async(req,res,next)=>{
    try{
    const nameEn=req.body.nameEn
    const nameAr=req.body.nameAr
    const userId=req.params.userId;
    const user=await User.findById(userId)
    if(req.user._id.toString()!==user._id.toString()){
        return res.status(401).json({
            message:"not authorized"
        })
     }
    if(!user){
        return res.status(404).json({
            message:"not found "
        })
    }
    user.nameAr=nameAr;
    user.nameEn=nameEn;
    await user.save()

    res.status(200).json({
        message:"edited sucess",
        user
    })
}
catch(error){
    res.status(500).json({error})
}
}


exports.postFollow=async(req,res,next)=>{
    try{
    const userFollowing=req.params.userId;
    if(!req.user.id){
        return res.status(401).json({
            message:"not authorized"
        })
     }
    const user=await User.findById(userFollowing);
     user.followers.forEach(follower => {
         if(req.user.id.toString()===follower.user.toString()){
             return res.status(409).json({
                 message:"already followed"
             })
         }
         
     });

    user.followers.push({user:req.user.id,email:req.user.email})
    await user.save();
    res.status(201).json({
        message:"followed successfully",
        user
    })
}
catch(error){
    res.status(500).json({error})
}
}