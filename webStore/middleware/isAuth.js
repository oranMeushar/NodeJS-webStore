const isAuth = (req, res, next) =>{
    if(req.session.isLoggedIn){
        next();
    }
    else{
        res.redirect("/login");
    }
}

const isAdmin = (req, res, next) =>{
    if(req.session.isAdmin){
        next();
    }
    else{
        res.redirect("/login");
    }
}


module.exports.isAuth = isAuth;
module.exports.isAdmin = isAdmin;