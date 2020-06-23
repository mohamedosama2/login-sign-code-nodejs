const Post=require('../models/posts');
const User=require('../models/user');

exports.getPosts=async(req,res,next)=>{
    try{
    const posts=await Post.find()
    const post=await Post.findById('5eeeed4cd97fce444085f1d2').populate('likes.user')
    console.log(post)
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



exports.editPost=async(req,res,next)=>{
    try{
    const postId=req.params.postId;
    const text=req.body.text;
    const post=await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message:"can't find the post "
        })
    }
    if(post.user.toString()!==req.user.id.toString()){
       return res.status(403).json({
            message:"forbidden"
        })
     }
    
    post.text=text;
    await post.save();
    res.status(200).json({
        message:"edited sucessfully",
        post
    })
}
catch(error){
    res.status(500).json({error})
}
}

exports.addPost=async(req,res,next)=>{
    const text=req.body.text;
    if(!req.user.id){
        return res.status(401).json({
             message:"not authorized"
         })
      }
    const post=new Post({
        text,
        user:req.user.id
    });
    await post.save();
    res.status(201).json({
        message:"addedd successfully",
        post
    })
}

