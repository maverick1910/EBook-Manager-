var PORT= process.env.PORT || 3000;
var express=require("express");
var mongoose=require('mongoose');
var passport=require('passport');
const LocalStrategy = require('passport-local').Strategy
const app=express();
var bodyparser=require("body-parser");
var methodOverride=require("method-override");
require('dotenv').config();

var Site= require('./models/db');
var User= require('./models/user');

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
const flash = require('express-flash')
const session = require('express-session')
app.use(methodOverride("_method"));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AITH_TOKEN;
const client = require('twilio')(accountSid, authToken);


mongoose.connect( 'mongodb+srv://akkhill1910:konduruakhil@ebook.fn8xk.mongodb.net/perify?retryWrites=true&w=majority' ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected', () =>{
    console.log('Mongoose is connected');
});

//Routes
app.get('/sign-in',function(req,res){
    res.render('sign-in')
})


app.get('/',function(req,res){
    Site.find({},function(err,sites){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('index',{site:sites});
        }
    });
});
app.get('/admin',checkAuthenticated,function(req,res){
    Site.find({},function(err,sites){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('admin-books',{site:sites});
        }
    });
});
// const newUser= new User({username:"admin@perify.com",
// password:"admin"
// });
//    newUser.save((error)=>{
//        if(error){
//            res.status(500).json({msg:"Server Error"});
//        }
//        else{  console.log("done");
//        ;
//    }
//    })
var auth=false

passport.use(new LocalStrategy(
    function(username, password, done) {
        
       User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
         if (!user) { return done(null, false); }
         if (user.password!=password) { return done(null, false); }
         auth=true
         return done(null, user);
       });
    }
  ));
  app.use(passport.initialize())
  app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.session())
  
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
 app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/sign-in' ,successRedirect: '/admin',failureFlash: true}),
  function(req, res) {
    res.redirect('/admin');
  });


  function checkAuthenticated(req, res, next) {
    if (auth) {
      return next()
    }
  
    res.redirect('/sign-in')
  }
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/admin')
    }
    next()
  }
  

app.get('/buy',function(req,res){
    Site.find({},function(err,sites){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('sign-up',{site:sites});
        }
    });
});

app.post('/confirm',function(req,res){
    fname=req.body.fname;
    email=req.body.email;
    bname=req.body.bname;
    bfile=req.body.bfile;
    phno=req.body.phno;
    console.log(req.body)
    
    
        client.messages
            .create({
                body: '\n' + '\n Your Transaction has been processed ' + '\n  Your Book is on the way . Your Details are' + '\n First Name: ' + [req.body.fname]  + '\n Email: ' + [req.body.email] + '\n Book Name: ' + [req.body.bname] + '\n Book Link: ' + [req.body.bfile] ,
                from: '+12052368255',
                to: [req.body.phno]
            })
            .then(message => console.log(message.sid))
            .catch((err) => console.log(err));
            res.render('confirm-buy');
    
    

})

app.post('/delete',function (req,res){
console.log(req.query.id)
Site.findOne({_id: req.query.id}, function (error, site){
    
    site.remove();

});
res.redirect('/admin')
})
app.post('/edit',function (req,res){
    console.log(req.query.id)
    Site.findOne({_id: req.query.id}, function (error, sites){
    
        res.render('edit',{site:sites})
    
    });
});
app.post('/edited',function (req,res){
    console.log(req.query.title)
    console.log(req.body)
    
     Site.updateOne({title:req.query.title}, req.body.site, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");

         });
         res.redirect('/admin')
});
app.get('/adminbooks',function(req,res){
    Site.find({},function(err,sites){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('admin-books',{site:sites});
        }
    });
});
app.get('/category',function(req,res){
    Site.find({},function(err,sites){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('category',{site:sites});
        }
    });
});


app.get('/add',function(req,res){
    res.render('add-book')
});



// Redirect to main after creating new blog
app.post('/index',function(req,res){
    
    Site.create(req.body.site,function(err,newsite){
        if(err){
            res.render("add-book")
        }
        else{
            res.redirect('index')
        }
    });
});

app.listen(PORT,console.log('Server Up !!'));