const Post=require('../models/posts')
const User=require('../models/user');

exports.addComment=async(req,res,next)=>{
    try{
    const postId=req.params.postId;
    const text=req.body.text;
    const user=await User.findById(req.user.id)
    if(!user){
        return res.status(404).json({
            message:"not found"
        })
    }
    const post=await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message:"not found"
        })
    }
    post.comments.push({text:text,user:req.user.id})
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
    if(!post){
        return res.status(404).json({
            message:"not found"
        })
    }
    post.comments.forEach(p => {
        if(p.id.toString()===commentId.toString()&&
           p.user.toString()===req.user.id.toString()){
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


    


