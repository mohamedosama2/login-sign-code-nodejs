const express=require('express');
const controllers=require('../controllers/user_operations')
const router=express.Router();
const passStr=require('../passport');
const passport=require('passport')
passport.authenticate('jwt',{session:false})


router.get('/getUsers',controllers.getUsers);
router.get('/getProfile',passport.authenticate('jwt',{session:false}),controllers.getProfile)
router.get('/getUser/:userId',passport.authenticate('jwt',{session:false}),controllers.getUser)
router.put('/editUser/:userId',passport.authenticate('jwt',{session:false}),controllers.editUser)
router.post('/postFollow/:userId',passport.authenticate('jwt',{session:false}),controllers.postFollow)


module.exports=router;