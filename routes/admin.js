const express=require('express')
const controllers=require('../controllers/admin')
const passStr=require('../passport');
const passport=require('passport')
const router=express.Router();


router.get('/getUsers',passport.authenticate('jwt',{session:false}),controllers.getUsers);
router.get('/getUser/:userId',passport.authenticate('jwt',{session:false}),controllers.getUser)
router.get('/getPosts',passport.authenticate('jwt',{session:false}),controllers.getPosts)
router.get('/getPost/:postId',passport.authenticate('jwt',{session:false}),controllers.getPost)
router.delete('/deleteComment/:postId/:commentId',passport.authenticate('jwt',{session:false}),controllers.deleteComment);


module.exports=router;