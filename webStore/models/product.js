const getDb = require("../util/database").getDb;
const mondodb = require("mongodb");
const fs = require("fs");

class Product{
    constructor(title, price, description, image){
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    static async save(product){
        const db = getDb();
        await db.collection('products').insertOne(product);
    }

    static async fetchAll(){
        const db = getDb();
        const data = await db.collection('products').find({}).toArray();
        return data;
    }

    static async fetchById(id){
        const db = getDb();
        const data = await db.collection('products').findOne({_id:new mondodb.ObjectID(id)});
        return data;
    }

    static async setById(id, title, imagePath, price, description){
        const db = getDb();

        if (imagePath) {
            await db.collection('products').updateOne(
                {_id:new mondodb.ObjectID(id)},
                {$set:{title:title, image:imagePath, price:price, description:description}}
            )
        }

        else{
            await db.collection('products').updateOne(
                {_id:new mondodb.ObjectID(id)},
                {$set:{title:title, price:price, description:description}}
            )
        }
    }

    static async removeById(id){
        const db = getDb();
        const product = await db.collection('products').findOne({_id:new mondodb.ObjectID(id)});
        const productPath = product.image;

        fs.unlink(productPath, (err) =>{
            if (err) {
                console.log(err);
            }
        })
        
        await db.collection('products').deleteOne({_id:new mondodb.ObjectID(id)});
    }

    static async getInfo(cartIds){
        const db = getDb();
        const products = await db.collection('products').find({_id : {$in : cartIds}}).toArray();
        return products; 
    }
}

module.exports = Product;
