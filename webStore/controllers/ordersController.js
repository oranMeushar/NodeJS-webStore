const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");
const mongodb = require("mongodb");
const Product = require("../models/product");

const getOrders = async(req, res, next) =>{
    res.render("orders", {
        url:req.url,
        order:req.session.order,
    })
}

const postOrders = async (req, res, next) =>{
    const user = await User.exist(req.session.user.email);
    const cart = user.cart;
    req.session.user.cart = [];
    await User.setCart(user, []);

    if(req.session.order){
        const currentProducts = req.session.order.userProducts;
        let exist = false;

        for (let i = 0; i < cart.length; i++){
            for (let j = 0; j < currentProducts.length; j++){
                if(cart[i].id == currentProducts[j].id){
                    currentProducts[j].count += cart[i].count;
                    exist = true;
                }
            }
            if (!exist) {
                currentProducts.push(cart[i])
            }
            exist = false;
        }

       req.session.order.userProducts =  currentProducts;
       req.session.save(()=>{
        res.redirect("/orders");
    })
    }
    else{
        req.session.order = new Order(user.email, user._id, cart);
        req.session.save(()=>{
            res.redirect("/orders");
        })
    }  
}

const getOrdersDetails = async (req, res, next) =>{
    const id = req.params.orderId;
    let totalPrice = 0;
    let totalItems = 0
    let idsArray = [];
    let userOrder = req.session.order;

    if(!userOrder){
        userOrder =  await Order.existById(id);
        idsArray = userOrder.userProducts.map((item)=>{
            return new mongodb.ObjectID(item.id)
        })
    }

    idsArray = userOrder.userProducts.map((item)=>{
        return new mongodb.ObjectID(item.id)
    })

    const cartInfo =  await Product.getInfo(idsArray);

    for (let i = 0; i < userOrder.userProducts.length; i++) {
        cartInfo[i].count = userOrder.userProducts[i].count;
        totalPrice += (parseInt(cartInfo[i].count) * parseInt(cartInfo[i].price))
    }

    userOrder.userProducts.forEach(item => {
        totalItems += item.count;
    });

    const fileName = "details-" + id + ".pdf";
    const filePath = path.join('orders', fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.pipe(res);


    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    //**************************************
    //*write order information to a pdf file
    //***************************************
    doc.fillColor('black').fontSize(14).text(today,80,50);

    doc.fillColor('forestgreen').fontSize(20).text('User: ',80,120,{
        lineBreak:false,  
    })

    doc.fillColor('black').fontSize(16).text(userOrder.userEmail);


    doc.fillColor('forestgreen').fontSize(24).text('Items: ',80,160)
    doc.fontSize(20);
    doc.x = 100;
    for (let i = 0; i < cartInfo.length; i++) {
        doc.fillColor('forestgreen').fontSize(20).text(`${cartInfo[i].title}: `,{lineBreak:false}).fillColor('black').fontSize(18).text(`Quantity: ${cartInfo[i].count}, Price: ${cartInfo[i].price}$`);
        doc.moveDown();
        doc.x = 100;
    }
    doc.x = 80;
    doc.fillColor('crimson').fontSize(20).text(`Total Items: `,{lineBreak:false}).fillColor('black').fontSize(18).text(totalItems);
    doc.x = 80;
    doc.moveDown();
    doc.fillColor('crimson').fontSize(20).text(`Total Price: `,{lineBreak:false}).fillColor('black').fontSize(18).text(totalPrice + "$");
    doc.end();
}

const postDeleteOrder = async (req, res, next) =>{ 
    req.session.order = null
    req.session.save(()=>{
        res.redirect("/orders");
    })
    
}

const postPayment = async(req, res, next) =>{
    const email = req.session.order.userEmail;
    const userId = req.session.order.userId;
    const userProducts = req.session.order.userProducts;
    const order = new Order(email, userId, userProducts);
    Order.save(order);
    req.session.order = null
    req.session.save(()=>{
        //res.redirect("/orders");
    })
}


module.exports.postOrders = postOrders;
module.exports.getOrders = getOrders;
module.exports.getOrdersDetails = getOrdersDetails;
module.exports.postDeleteOrder = postDeleteOrder;
module.exports.postPayment = postPayment;