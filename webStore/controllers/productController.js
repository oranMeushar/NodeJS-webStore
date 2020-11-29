const Product = require("../models/product");

const getProducts = async (req, res, next) =>{
    const data = await Product.fetchAll();
    res.render("products", {
        url:req.url,
        data:data
    })
}

const getProductsDetail = async (req, res, next) =>{
    let id = req.params.id;

    const products = await Product.fetchAll();
    const randomItems = getRandomItems(products);
    
    const foundItem = products.find(item =>{
        return item._id == id;
    })

    res.render("productsDetail", {
        url:req.url,
        item:foundItem,
        randomImg:randomItems,
    })
    
}

function getRandomItems(data){
    let randomItems = [];
    for(i = 0; i < 5; i++){
        let randomItem = Math.floor(Math.random()*(data.length));
        randomItems.push(data[randomItem])
    }
    return randomItems
}

module.exports.getProducts = getProducts;
module.exports.getProductsDetail = getProductsDetail;