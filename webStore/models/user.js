const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User{
    constructor(name, email, password){
         this.name = name;
         this.email = email;
         this.password = password;
         this.token = null;
         this.tokenExpiration = null;
         this.cart = [];
    }
    
    async save(){
        const db = getDb();
        await db.collection('users').insertOne(this);
    }

    static async fetchAll(){
        const db = getDb();
        const data = await db.collection('users').find({}).toArray();
        return data;
    }

    static async deleteById(userId){
        const db = getDb();
        db.collection('users').deleteOne({_id:new mongodb.ObjectID(userId)});
    }


    static async exist(email){
        const db = getDb();
        const user = await db.collection('users').findOne({email:email});
        return user;
    }


    static async getAdmin(){
        const db = getDb();
        const admin = await db.collection('users').findOne({});
        return admin;
    }

    static setToken(email, token){
        const db = getDb();
         db.collection('users').updateOne(
            {email:email},
            {$set:{token:token, tokenExpiration:Date.now() + 3600000 }}
        )
    }


    static async findByToken(token){
        const db = getDb();
        const user = await db.collection('users').findOne({token:token, tokenExpiration:{$gt:Date.now()}})
        return user;
    }

    static async setNewPassword(token,password){
        const db = getDb();
        db.collection('users').updateOne(
            {token:token},
            {$set:{password:password}}
        )
    }

    static async setCart(user, newCart){
        const db = getDb();
        await db.collection('users').updateOne(
            {email:user.email},
            {$set:{cart:newCart}}
        )
    }
}

module.exports = User;