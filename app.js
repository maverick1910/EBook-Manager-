var PORT= process.env.PORT || 3000;
var express=require("express");
var mongoose=require('mongoose');
const app=express();
var bodyparser=require("body-parser");
var methodOverride=require("method-override");
require('dotenv').config();

var Site= require('./models/db');

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
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
app.get('/admin',function(req,res){
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
app.post('/',function(req,res){
    
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