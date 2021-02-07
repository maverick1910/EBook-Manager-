var mongoose=require("mongoose")
var siteSchema =mongoose.Schema({
    title:String,
    image:String,
    author:String,
    desc:String,
    category:String,
    price:String,
    file:String
});
var Site =mongoose.model("Site",siteSchema);
module.exports=Site;