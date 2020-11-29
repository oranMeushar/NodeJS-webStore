const Product = require("../models/product");

const getHome = async (req, res, next)=>{
    
    const data = await Product.fetchAll();
   
    res.render("home",{
        url:req.url,
        data:data
    });
}

module.exports.getHome = getHome;