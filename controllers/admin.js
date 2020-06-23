const User=require('../models/user');
const Post=require('../models/posts');
const Email=require('../models/email');
const bcrypt=require('bcryptjs');

exports.getUsers=async(req,res,next)=>{
    try{
    const users=await User.find()
    if(!users){
       return res.status(404).json({
            message:"not found users"
        })
    }
    if(req.user.rule!=='admin'){
        return res.status(401).json({
            message:"not Authorized"
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



exports.getUser=async(req,res,next)=>{
    try{
    const userId=req.params.userId;
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:"not found"
        })
    }
    if(req.user.rule!=='admin'){
        return res.status(401).json({
            message:"not Authorized"
        })
    }
    
    const posts=await Post.find()
    if(!posts){
        return res.status(404).json({
            message:"not found "
        })
    }

    const postComment=[]
    const comments=[]
    const postlikes=[]

    posts.forEach(post => {
        post.comments=post.comments.filter(function(c){
            if(userId.toString()===c.user.toString()){
                comments.push(c.text)
                postComment.push(post.text)
                return userId.toString()===c.user.toString()
             }
        })
        post.likes=post.likes.filter(function(l){
            if(l.user){
                if(userId.toString()===l.user.toString()){
                    postlikes.push(post.text)
                    return userId.toString()===l.user.toString()
                }
            }
        })
    });

    res.status(200).json({
        message:"fetched successfully",
        "posts that  Liked =>":postlikes,
        'post comments =>':postComment,
        'comments are =>':comments
    })
}
catch(error){
    res.status(500).json({error})
}
}


exports.getPosts=async(req,res,next)=>{
    try{
    const posts=await Post.find()
    if(req.user.rule!=='admin'){
        return res.status(401).json({
            message:"not Authorized"
        })
    }
    if(!posts){
       return res.status(404).json({
            message:"can't find posts "
        })
    }
    res.status(200).json({
        message:"sucess get posts",
        posts
    })
}
catch(error){
    res.status(500).json({error});
}
}


exports.getPost=async(req,res,next)=>{
    try{
        postId=req.params.postId;
        if(req.user.rule!=='admin'){
            return res.status(401).json({
                message:"not Authorized"
            })
        }
    const post=await Post.findById(postId)
    if(!post){
       return res.status(404).json({
            message:"can't find "
        })
    }

 
    res.status(200).json({
        message:"sucess get post",
        post:post
    })
}
catch(error){
    res.status(500).json({error});
}
}



exports.deleteComment=async(req,res,next)=>{
    try{
    postId=req.params.postId;
    commentId=req.params.commentId;
    var x=0;
    const user=await User.findById(req.user._id)
    if(!user){
        return res.status(401).json({
            message:"not authorized"
        })
    }
    if(req.user.rule!=='admin'){
        return res.status(401).json({
            message:"not Authorized"
        })
    }
    const post=await Post.findById(postId);     
    if(!post){
        return res.status(404).json({
            message:"not found post"
        })
    }  
    post.comments=post.comments.filter(function(p){
       return p._id.toString()!==commentId.toString()
    })

    await post.save();
     res.status(200).json({
         message:"deleted successfully",
         post
     })
    }
    catch(error){
        res.status(500).json({error})
    }   
    }


    exports.changeInfo=async(req,res,next)=>{
        try{
        const nameAr=req.body.nameAr;
        const nameEn=req.body.nameEn;
        const email=req.body.email;
        const password=req.body.password;
        const newPassword=req.body.newPassword;
        if(req.user.rule!=='admin'){
            return res.status(401).json({
                message:"not Authorized"
            })
        }
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"not found"
            })
        }
        const email1=await Email.findOne({email:req.user.email})
        if(!email1){
            return res.status(404).json({
                message:"not found"
            })
        }
      
        const doMatch=await bcrypt.compare(password,user.password);
        if(!doMatch){
            if(!user){
                return res.status(400).json({
                    message:"wrong password"
                })
            }
        }
        user.nameAr=nameAr;
        user.nameEn=nameEn;
        user.email=email;
        user.password=newPassword;
        email1.email=email
        await email1.save();
        await user.save();
        res.status(200).json({
            message:"information has changed sucessfully",
            user
        })
    }
    catch(error){
        res.status(500).json({error});
    }

    }