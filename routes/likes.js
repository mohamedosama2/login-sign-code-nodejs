const express=require('express');
const controllers=require('../controllers/likes')
const passStr=require('../passport');
const passport=require('passport')

const router=express.Router();

router.post('/addLike/:postId',passport.authenticate('jwt',{session:false}),controllers.addLike)

module.exports=router