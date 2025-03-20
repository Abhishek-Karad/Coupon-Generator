const express=require('express');
const userController=require('../controller/user')
const router=express.Router();
const csrf = require("csurf");


router.get('/',(req,res,next)=>{
    res.render('index',{
        path:'/',
        coupon: null, message: null ,
        csrfToken:req.csrfToken()
         }
    )
});


router.post("/claim-coupon",userController.claimCoupon);





module.exports=router;