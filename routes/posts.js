const express=require('express');
const controllers=require('../controllers/posts')
const passStr=require('../passport');
const passport=require('passport')


const router=express.Router();

router.get('/getPosts',controllers.getPosts)
router.get('/getPost/:postId',passport.authenticate('jwt',{session:false}),controllers.getPost)
router.put('/editPost/:postId',passport.authenticate('jwt',{session:false}),controllers.editPost)
router.post('/addPost',passport.authenticate('jwt',{session:false}),controllers.addPost)


module.exports=router;