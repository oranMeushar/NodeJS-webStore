const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sgTransport({
    auth:{
        api_key:'Please use your own API key from SendGrid'
    }
}))

const getSignUp = (req, res, next) =>{
    res.render("signUp",{
        url:req.url,
        errorMessage:req.flash('errorMessage'),
        email:"",
        userName:"",
        password:"",
        confirmPassword:"",
    });
}

const postSignUp = async (req, res, next) =>{
    const {name, email, password, confirmPassword} = req.body;
    const user = await User.exist(email);
    if(user){
        req.flash('errorMessage', 'Email exists in database');
        req.session.save(() =>{
            res.render("signUp", {
                url:req.url,
                errorMessage:req.flash('errorMessage'),
                email:"",
                userName:name,
                password:password,
                confirmPassword:confirmPassword,
            })
        })
        
    }

    else if(password != confirmPassword){
        req.flash('errorMessage', 'Passwords are not match');
        req.session.save(()=>{
            res.render("signUp",{
                url:req.url,
                error:req.flash('error'),
                email:email,
                userName:name,
                password:"",
                confirmPassword:"",
                errorMessage:req.flash('errorMessage'),
            })
        })
    }

    else{
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User(name, email, hashPassword);
        user.save();
        req.flash('successMessage', 'Successfully Signed Up');
        req.session.save(()=>{
            res.redirect("/login");
        })
    }   
}

const getLogin = (req, res, next) =>{
    res.render("login", {
        url:req.url,
        errorMessage:req.flash('errorMessage')
    });
}

const postLogin = async (req, res, next)=>{
    const {email, password} = req.body;
    const user = await User.exist(email);

    if(user){
        const isMatch = await bcrypt.compare(password, user.password);     
        const admin = await User.getAdmin();

        if(isMatch){
            req.session.isLoggedIn = true;

            if(admin.email == email){
            req.session.isAdmin = true;
            }

            req.session.user = new User(user.name, user.email, user.password);
            req.session.user.cart = user.cart;

            req.session.save(()=>{
                res.redirect("/");
            }) 
        }
        else{
            req.flash('errorMessage', 'Password is incorrect');
            req.session.save(()=>{
                res.redirect("/login");
            })
        }
        
    }

    else{
        req.flash('errorMessage', 'Please sign up before login');
        req.session.save(()=>{
            res.redirect("/login");
        })
    }
}


const getLogout = (req, res, next) =>{
    req.session.destroy((err)=>{
        res.redirect("/");
    });
}

const getReset = (req, res, next) =>{
    res.render("reset", {
        url:req.url,
        errorMessage:req.flash('errorMessage'),
        successMessage:req.flash('successMessage')
    })
}


const postReset = async (req, res, next) =>{
    const email = req.body.email;

    crypto.randomBytes(32, async(err, buffer) =>{
        if(err){
            console.log(err);
        }
        else{
            const token = buffer.toString('hex');
            const user = await User.exist(email);

            if(user){
                User.setToken(email, token); 
                transporter.sendMail({
                    to:email,
                    from:' use this -> < https://app.sendgrid.com/settings/sender_auth/senders/new > url to create a sender mailer',
                    subject:'Password Reset',
                    html:`<p>You requested a password reset.
                    click this<a href="http://localhost:3000/newPassword/${token}">link</a> to change your password</p>`
                })
                req.flash('successMessage', 'Please check your email');
                req.session.save(()=>{
                    res.redirect("/reset");
                })
            }
        
            else{
                req.flash('errorMessage', 'Email was not found in database');
                req.session.save(()=>{
                    res.redirect("/reset");
                })
            }
        }
    })
}

const getNewPassword = async (req, res, next) =>{
    const token = req.params.token;
    const user = await User.findByToken(token);
    if(user){
        res.render("newPassword",{
            url:req.url,
            errorMessage:req.flash('errorMessage'),
            successMessage:req.flash('successMessage'),
            token:token
        })
    }
    else{

    }
    
} 

const postNewPassword = async (req, res, next) =>{
    const {password, token} = req.body;
    const user = await User.findByToken(token);

    if(user){
        const hashPassword = await bcrypt.hash(password, 10);
        User.setNewPassword(token, hashPassword);
        req.flash('successMessage', 'Password changed successfully')
        req.session.save(()=>{
            res.redirect("/login");
        })
    }

    else{
        console.log("an error occured");
        //handle it
    }
    

}

module.exports.getSignUp = getSignUp;
module.exports.postSignUp = postSignUp;

module.exports.getLogin = getLogin;
module.exports.postLogin = postLogin;

module.exports.getLogout = getLogout;

module.exports.getReset = getReset;
module.exports.postReset = postReset;

module.exports.getNewPassword = getNewPassword;
module.exports.postNewPassword = postNewPassword;