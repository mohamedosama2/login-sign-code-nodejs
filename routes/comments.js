const express=require('express');
const controllers=require('../controllers/comments');
const passStr=require('../passport');
const passport=require('passport')
const router=express.Router();

router.post('/addComment/:postId',passport.authenticate('jwt',{session:false}),controllers.addComment)
router.put('/editComment/:postId/:commentId',passport.authenticate('jwt',{session:false}),controllers.editComment)



module.exports=router