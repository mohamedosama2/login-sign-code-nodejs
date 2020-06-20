const Post=require('../models/posts')
const User=require('../models/user');

exports.addComment=async(req,res,next)=>{
    try{
    const postId=req.params.postId;
    const text=req.body.text;
    const user=await User.findById(req.user.id)
    if(!user){
        return res.status(401).json({
            message:"not authorized"
        })
    }
    const post=await Post.findById(postId);
    post.comments.push({text:text,user:req.user.id,email:req.user.email})
   await post.save();
    res.status(200).json({
        message:"sucess",
        post
    })
}
catch(error){
    res.status(500).json({error})
}
}

exports.editComment=async(req,res,next)=>{
    try{
    postId=req.params.postId;
    commentId=req.params.commentId;
    let x=0;
    const text=req.body.text;
    const user=await User.findById(req.user.id)
    if(!user){
        return res.status(401).json({
            message:"not authorized"
        })
    }
    const post=await Post.findById(postId);
    post.comments.forEach(p => {
        if(p.id.toString()===commentId.toString()&&
           p.user.toString()===req.user.id.toString()){
            console.log(p);
            p.text=text
            x=1
        }        
    })
    if(x=0){
            return res.status(401).json({
                message:"not authorized"
            })
        }
    await post.save()
    res.status(200).json({
        message:"edited sucess",
        post
    })
}
catch(error){
    res.status(500).json({
        error
    })
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
    const post=await Post.findById(postId);
    post.comments.forEach(p => {
        if(p.id.toString()===commentId.toString()&&
           p.user.toString()===req.user.id.toString()){
            x=1
        }        
    })

    if(x=0){
        return res.status(401).json({
            message:"not authorized"
        })
    }
    post.comments=post.comments.filter(function(p){
       return p._id.toString()!==commentId.toString()&&
              p.user.toString()===req.user.id.toString()
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


    


