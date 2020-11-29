const Product = require("../models/product");

const getManageProduct = async (req, res, next) =>{
    const data = await Product.fetchAll();
    res.render("manageProduct", {
        url:req.url,
        data:data
    })
}

const getEditProduct = async (req, res, next) =>{
    const id = req.params.id;
    const product = await Product.fetchById(id);
    res.render("addProduct", {
        url:req.url,
        edit:req.query.edit,
        data:product,
        errorMessage:req.flash('errorMessage')
    })
}

const postEditProduct = async (req, res, next) =>{
    const {id, title, price, description} = req.body;
    const image = req.file;

    if(image){
        const imagePath = image.path;
        await Product.setById(id, title, imagePath, price, description);
        res.redirect("/manageProduct");
    }

    else{
        await Product.setById(id, title, null, price, description);
        res.redirect("/manageProduct");
    }
}

const postDeleteItem = async (req, res, next) =>{
    const id = req.body.id;
    await Product.removeById(id);
    res.redirect("/manageProduct");
}

module.exports.getManageProduct = getManageProduct;
module.exports.getEditProduct = getEditProduct;
module.exports.postEditProduct = postEditProduct;
module.exports.postDeleteItem = postDeleteItem;