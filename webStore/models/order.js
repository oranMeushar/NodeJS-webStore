const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
const fs = require("fs");
const path = require("path");

class Order{
    constructor(userEmail, userId, userProducts){
        this.userEmail = userEmail;
        this.userId = userId;
        this.userProducts = userProducts;
        this.newItem = true;
    }

    static save(order){
        const db = getDb();
        db.collection('orders').insertOne(order);
    }

    static async exist(userEmail){
        const db = getDb();
        const order = await db.collection('orders').findOne({userEmail:userEmail});
        return order;
    }

    static async existById(id){
        const db = getDb();
        const order = await db.collection('orders').findOne({_id:new mongodb.ObjectID(id)});
        return order;
    }

    static async setUserProducts(userEmail, userProducts){
        const db = getDb();
        db.collection('orders').updateOne(
            {userEmail:userEmail},
            {$set:{userProducts:userProducts}}
        )
    }

    static async remove(id){
        const filePath = path.join('orders', `details-${id}.pdf`)
        fs.unlink(filePath, (err) =>{
            if (err) {
                console.log(err);
            }
        })
        const db = getDb();
        await db.collection('orders').deleteOne({_id:new mongodb.ObjectID(id)});
    }

    static async fetchById(userId){
        const db = getDb();
        const result = await db.collection('orders').find({userId:new mongodb.ObjectID(userId)}).toArray();
        return result;
    }

    static async fetchAll(){
        const db = getDb();
        const data = await db.collection('orders').find({}).toArray();
        return data;
    }

    static async updateNewItemField(id){
        const db = getDb();
        db.collection('orders').updateOne(
            {_id:new mongodb.ObjectID(id)},
            {$set:{newItem:false}}
        )
    }

}

module.exports = Order