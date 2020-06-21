const Post=require('../models/posts')
const User=require('../models/user');

exports.addLike=async(req,res,next)=>{
    const userId=req.user._id;
    const postId=req.params.postId;
    const user=await User.findById(userId)
    if(!user){
        return res.status(401).json({
            message:"un authorized"
        })
    }
    const post=await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            message:"not founded"
        })
    }
    let x=0;
  await  post.likes.forEach( like => {
        if(like.user){
         if(req.user.email===like.email){
             x=1
            return res.status(409).json({
                message:"already liked" 
            })
        }
    }   
    });
    console.log(x)
    if(x==1){
        console.log(1)
        return res.status(409).json({
            message:"already liked" 
        })
    }
    
    if(!post.likes[0]){
        console.log("sa77")
        post.likes.unshift({number:1})
        post.likes.push({user:userId,email:req.user.email})
        await post.save();

    }else{
        var newNumber=post.likes[0].number;
        newNumber=newNumber+1;
        post.likes[0].number=newNumber;
        post.likes.push({user:userId,email:req.user.email})
        await post.save();

    }
    res.status(200).json({
        message:"like added",
        post
    })
}



