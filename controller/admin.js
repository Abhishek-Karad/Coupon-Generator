const bcrypt=require('bcrypt')
const User=require('../model/user');
const Coupon = require('../model/coupoun');
exports.getadminside=(req,res,next)=>{
    res.render('admin',{
        path:'/admin/admin',
        csrfToken:req.csrfToken()
    })
}


exports.getLogin=(req,res,next)=>{
    res.render('login',{
        path:'/admin/login',
        csrfToken:req.csrfToken()
    })
}

exports.getsignup=(req,res,next)=>{
    res.render('signup',{
        path:'admin/signup',
        csrfToken:req.csrfToken()
    })
}

exports.postsignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(UserDOC => {
            if (UserDOC) {
                console.log("User Exists!");
                return res.redirect('/admin/login'); 
            }
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
            
        })
        .then(() => {
            console.log("User Added!");
            res.redirect('/admin/login');  
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postlogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/admin/login'); 
            }

            return bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save(err => { 
                            if (err) console.log(err);
                            res.redirect('/admin/admin'); 
                        });
                    }
                    return res.redirect('/admin/login'); 
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/login'); 
        });
};

exports.postlogout=(req,res)=>{
    exports.adminLogout = (req, res) => {
        res.clearCookie("adminToken"); // ✅ Clear authentication token
        res.redirect("/admin/login"); // ✅ Redirect to login page
      };
    }
exports.getAdminDashboard = (req, res) => {
 Promise.all([
   Coupon.find(),  // Fetch all coupons
   User.find()     // Fetch all users
 ])
 .then(([coupons, users]) => {
    res.render("admin", { 
      coupons: coupons || [], // Ensure an empty array is passed if no coupons exist
      users: users || [], 
      message: null ,
      csrfToken:req.csrfToken()
    });
  })
   .catch(error => {
     console.log("Error fetching dashboard data:", error);
     res.render("admin", { coupons: [], users: [], message: "Error loading data." });
   });
};




exports.addCoupon = (req, res) => {
 const { code, expiryDate } = req.body;


 if (!code) {
   return res.render("admin", { message: "Coupon code is required!", coupons: [], users: [] , csrfToken: req.csrfToken() });
 }


 Coupon.create({ code, expiryDate })
   .then(() => res.redirect("/admin/admin"))
   .catch(error => {
     console.log("Error adding coupon:", error);
     res.render("admin", { message: "Error adding coupon.", coupons: [], users: [], csrfToken: req.csrfToken()  });
   });
};




exports.toggleCoupon = (req, res) => {
 const { id } = req.params;


 Coupon.findById(id)
   .then(coupon => {
     if (!coupon) return res.redirect("/admin/admin");


     coupon.isClaimed = !coupon.isClaimed; // Toggle claimed status
     return coupon.save();
   })
   .then(() => res.redirect("/admin"))
   .catch(error => {
     console.log("Error updating coupon:", error);
     res.render("admin", { message: "Error updating coupon.", coupons: [], users: [] });
   });
};




exports.deleteCoupon = (req, res) => {
 const { id } = req.params;


 Coupon.findByIdAndDelete(id)
   .then(() => res.redirect("/admin/admin"))
   .catch(error => {
     console.log("Error deleting coupon:", error);
     res.render("admin", { message: "Error deleting coupon.", coupons: [], users: [] });
   });
};




exports.listUsers = (req, res) => {
 User.find()
   .then(users => res.render("users", { users }))
   .catch(error => {
     console.log("Error fetching users:", error);
     res.render("users", { users: [], message: "Error loading users." });
   });
};



