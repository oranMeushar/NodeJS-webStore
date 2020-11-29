const User = require("../models/user");
const Product = require("../models/product");
const { ObjectID } = require("mongodb");

const getCart = async(req, res, next) =>{
    const email = req.session.user.email;
    const user = await User.exist(email);
    let totalItems = 0;
    let totalPrice = 0;

    user.cart.forEach(item => {
        totalItems += item.count;
    });

    //get an array of type object id so i could send it to getInfo()
    const idsArray = user.cart.map((item)=>{
        return ObjectID(item.id)
    })

    const cartInfo =  await Product.getInfo(idsArray);

    for (let i = 0; i < user.cart.length; i++) {
        cartInfo[i].count = user.cart[i].count;
        totalPrice += (parseInt(cartInfo[i].count) * parseInt(cartInfo[i].price))
    }

    res.render("cart", {
        url:req.url,
        data:cartInfo,
        totalItems:totalItems,
        price:totalPrice,
    });
}

const postAddCart = async (req, res, next) =>{
    const id = req.body.id;
    const item = {
        id:id,
        count:1
    }

    const cartItems = req.session.user.cart;

    const found = cartItems.find((item) =>{
        return item.id == id;
    })

    if(found){
        found.count++;
    }

    else{
        cartItems.push(item);
    }

    const user = await User.exist(req.session.user.email);

    await User.setCart(user, cartItems);

    res.redirect("/cart");
    
}

const postDeleteOne = async (req, res, next) =>{
    const id = req.body.id;

    const cartItems = req.session.user.cart;

    const found = cartItems.find((item) =>{
        return item.id == id;
    })

    if(found.count == 1){
        const index = cartItems.indexOf(found);
        cartItems.splice(index, 1);
    }

    else{
        found.count--;
    }

    const user = await User.exist(req.session.user.email);

    await User.setCart(user, cartItems);

    res.redirect("/cart");
}

const postDeleteAll = async(req, res, next) =>{
    const id = req.body.id;

    const cartItems = req.session.user.cart;

    const found = cartItems.find((item) =>{
        return item.id == id;
    })

    const index = cartItems.indexOf(found);
    cartItems.splice(index, 1);
    const user = await User.exist(req.session.user.email);

    await User.setCart(user, cartItems);

    res.redirect("/cart");
}

module.exports.postAddCart = postAddCart;
module.exports.getCart = getCart;
module.exports.postDeleteOne = postDeleteOne;
module.exports.postDeleteAll = postDeleteAll;