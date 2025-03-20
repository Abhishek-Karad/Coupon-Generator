const express=require('express');
const path=require('path');
const fs=require('fs');
const mongoose=require('mongoose');
const userRoutes=require('./routes/user');
const adminRoutes=require('./routes/admin');
const session=require('express-session');
const mongodbstore=require('connect-mongodb-session')(session);
const csrf=require('csurf');
const User=require('./model/user');
const app=express();
const cookieParser=require('cookie-parser');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

const store=new mongodbstore({
    uri:'mongodb+srv://abhishekkarad29:vUHRQR1BneEOPoB2@cluster0.26upo.mongodb.net/coupoun',
    collection:'sessions',
    
});

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream }));

// Set view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(
    session({
      secret: "thisisabigsecret",
      resave: false,
      saveUninitialized: false,
      store:store
    })
  );const csurfProtection=csrf();
app.use(csurfProtection);

app.use(cookieParser());

app.use(userRoutes);
app.use('/admin',adminRoutes);

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
  })

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.26upo.mongodb.net/${process.env.MONGO_DEFAULT_DB}`)
.then(()=>{
    console.log("Database Connected!");
    app.listen(process.env.PORT || 2020, "0.0.0.0", () => {
      console.log(`Server running on port `);
    });

})
.catch(err=>{
    console.log(err);
})
