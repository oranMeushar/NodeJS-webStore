const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session);


const app = express();

const homeRoute = require("./routes/home");
const authRoute = require("./routes/auth");
const addProductRoute = require("./routes/addProduct");
const manageProductRoute = require("./routes/manageProduct");
const cartRoute = require("./routes/cart");
const productRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const adminRoute = require("./routes/admin");

const database = require("./util/database");

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



const store = new MongoDBStore({
    uri:`mongodb+srv://<userName>:<password>@cluster0.sighz.mongodb.net/<bdname>?retryWrites=true&w=majority`,
    collection:'sessions'
});

app.use(session({
    secret:'please use your secret here',
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        maxAge:2000000
    }
}));

app.use(flash());



app.use((req, res, next) =>{
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.isAdmin = req.session.isAdmin;
    next();
});

app.use(homeRoute);
app.use(authRoute);
app.use(addProductRoute);
app.use(manageProductRoute);
app.use(cartRoute);
app.use(productRoute);
app.use(ordersRoute);
app.use(adminRoute);

database.connection()
.then(()=>{
    app.listen(3000, ()=>{
        console.log("server starts on port 3000");
    })
});

