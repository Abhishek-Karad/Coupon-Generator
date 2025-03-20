const express=require('express');
const adminController=require('../controller/admin');
const isAuth = require('../middleware/isAuth');
const router=express.Router();

router.get('/login',adminController.getLogin);

router.get('/signup',adminController.getsignup);

router.post('/signup',adminController.postsignup);

router.post('/login',adminController.postlogin);

router.get('/admin',adminController.getAdminDashboard);
router.post('/logout',adminController.postlogout);



// CRUD Routes for Coupons
router.post("/add-coupon", adminController.addCoupon);
router.post("/toggle-coupon/:id",adminController.toggleCoupon);
router.post("/delete-coupon/:id",  adminController.deleteCoupon);

// User Management
router.get("/users", adminController.listUsers);


module.exports=router;