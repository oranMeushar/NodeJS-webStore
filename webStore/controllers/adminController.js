const User = require("../models/user");
const Order = require("../models/order");

const getAdmin = (req, res, next) =>{
    res.render("admin", {
        url:req.url,
        data:[]
    })
}

const getUsers = async(req, res, next) =>{
    const users = await User.fetchAll();

    const result = users.map((user) =>{
        return {
            _id:user._id,
            name:user.name,
            email:user.email
        }
    })
    res.json(result);
}

const postDeleteUser = async(req, res, next) =>{
    User.deleteById(req.body.id);
    res.json({
        success:'user was deleted successfully',
    }) 
}

const postDeleteOrder = async(req, res, next) =>{
    Order.remove(req.body.id);
    res.json({
        success:'order was deleted successfully',
    }) 
}

const getHistory = async (req, res, next) =>{
    const id = req.params.userId;
    const userOrders = await Order.fetchById(id);
    const ordersIds = userOrders.map((order) =>{
        return order._id;
    })
    res.render("history",{
        url:req.url,
        orders:ordersIds,
    })
}

const getOrders = async(req, res, next) =>{
    const data = await Order.fetchAll();
    const filteredData = data.map((item) =>{
        return {
            id:item._id,
            newItem:item.newItem
        }
    })
    res.json(filteredData.reverse());
}

const postUpdateOrder = (req, res, next) =>{
    Order.updateNewItemField(req.body.id);
    res.json({
        succes:"order was successfully updated"
    })
}

module.exports.getAdmin = getAdmin;
module.exports.getUsers = getUsers;
module.exports.postDeleteUser = postDeleteUser
module.exports.getHistory = getHistory;
module.exports.postDeleteOrder = postDeleteOrder;
module.exports.getOrders = getOrders;
module.exports.postUpdateOrder = postUpdateOrder;