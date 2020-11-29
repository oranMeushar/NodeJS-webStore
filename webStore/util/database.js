const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let db;
const connection = () =>{
    return new Promise((resolve, reject) =>{
        MongoClient.connect(`mongodb+srv://<userName>:<password>@cluster0.sighz.mongodb.net<bdname>?retryWrites=true&w=majority`, { useUnifiedTopology: true })
        .then(client =>{
            console.log("connected to mongodb");
            db = client.db();
            resolve();
        })
        .catch(err =>{
            console.log(err);
        })
    })
    
}


const getDb = () =>{
    if(db){
        return db
    }
    else{
        console.log("No database was found");
    }
}


module.exports.connection = connection;
module.exports.getDb = getDb;




