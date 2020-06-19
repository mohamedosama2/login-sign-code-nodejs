const express=require('express');
const controllers=require('../controllers/users')
const router=express.Router();



router.post('/otp/send',controllers.otpSend);
router.post('/otp/verify',controllers.otpVerify);
router.post('/signup',controllers.signUp)
router.post('/signin',controllers.signIn)
router.post('/forget-password/send',controllers.forgetSend);
router.post('/forget-password/verify',controllers.forgetVerify);
router.post('/change-password',controllers.changePassword);




module.exports=router