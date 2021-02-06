var PORT= process.env.PORT || 3000;
var express=require("express");
const app=express();
var bodyparser=require("body-parser");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

//Routes
app.get('/',function(req,res){
    res.render('sign-in');
});
app.get('/index',function(req,res){
    res.render('index');
});
app.get('/add',function(req,res){
    res.render('add-book');
});
app.get('/books',function(req,res){
    res.render('book-page');
});
app.get('/viewbooks',function(req,res){
    res.render('book-pdf');
});
app.get('/confirm',function(req,res){
    res.render('confirm-buy');
});
app.get('/register',function(req,res){
    res.render('sign-up');
});
app.get('/admin',function(req,res){
    res.render('admin-books');
});

app.listen(PORT,console.log('Server Up !!'));