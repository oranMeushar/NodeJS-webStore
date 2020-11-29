const Product = require("../models/product");

const getAddProduct = (req, res, next) =>{
    res.render("addProduct", {
        url:req.url,
        edit:false,
        data:[],
        errorMessage:req.flash('errorMessage')
    })
}

const postAddProduct = async (req, res, next) =>{
    const {title, price, description} = req.body;
    const image = req.file;
    if(image){
        const imagePath = image.path;
        const newProduct = new Product(title, price, description, imagePath);
        await Product.save(newProduct);
        res.redirect("/");
    }

    else{
        req.flash('errorMessage', 'Must include an image');
        req.session.save(()=>{
            res.redirect("/addProduct");
        })
    }
}

module.exports.getAddProduct = getAddProduct;
module.exports.postAddProduct = postAddProduct;