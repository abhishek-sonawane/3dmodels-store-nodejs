require('dotenv').config()
const express = require('express')
const router = express.Router();
const User = require('../models/User')
const path = require('path')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')


const bodyParser = require('body-parser');
const { stat } = require('fs');
router.use(cookieParser());

router.use(express.urlencoded({extended:false}))

let err_msg;

//REGISTER
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())

router.get('/register', (req,res)=>{
    res.render("../views/login/register")
})



router.post('/register', async (req,res)=>{
    const existusername = await User.findOne({username:req.body.username})
    const existemail = await User.findOne({email:req.body.email})
    if(existusername){
        err_msg = 'this user already exist'
        return res.render('../views/login/register',{err_msg :err_msg}) 
    }

    if(existemail){

        err_msg = 'the user with this email already exist'
        return res.render('../views/login/register',{err_msg :err_msg}) 
    }
    
    try{
        const hashedpassword = await bcrypt.hash(req.body.password,10)

        const newUser =   new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedpassword
        })
        const savedUser = await newUser.save();
        // res.status(201).json(savedUser);
        res.redirect('/auth/login')
        // req.session.isAuth = true
        // res.redirect('/catalogue')
    }
    catch(err){
        res.status(500).json(err);
    } 
})





//LOGIN AUTH
const isLoggedin = (req,res,next)=>{
    if(req.session.isAuth){
        res.redirect('/')
    }else{
        next()
    }
}



router.get('/login',isLoggedin, (req,res)=>{
    res.render('../views/login/login.ejs')
})



router.post('/login', async (req,res)=>{
    const user = await User.findOne({username:req.body.username});
    // console.log(user.isLoggedin)
    if(!user){
        
        // return  res.status(401).json("wrong credentials");
        // return res.status(401).sendFile(path.join(__dirname,'../L.jpg'))
         err_msg = 'no such user found'
      return  res.render("../views/login/login",{err_msg:err_msg})

    }

    

    try{
    // !user && res.status(401).json("wrong credentials")
    // reqpassword !== req.body.password &&
    //     res.status(401).json("wrong credentials");
    // if(req.body.password ==user.password)
    if(await bcrypt.compare(req.body.password,user.password)){
                            const username = req.body.username;
                            const pass = req.body.password;
                            const uzer = {name:username,passw:pass}
                           

            if(username == process.env.ADMIN_AUTH_CREDENTIAL_USERNAME &&pass==process.env.ADMIN_AUTH_CREDENTIAL_PASSWORD){
                req.session.isAdmin = true;
            }
            req.session.isAuth = true;
            
        return res.redirect('/catalogue')
    }
    // const reqpassword =  user.password;
    // const {password, ...others} = user._doc;
    // console.log(reqpassword)
    else {
        err_msg = 'wrong username or password'
        return  res.render("../views/login/login",{err_msg:err_msg})
    }
    // res.status(200).json(others)
   
    }catch(err){
        console.log(err)
        err_msg = 'something went wrong'
        res.render("../views/login/login",{err_msg:err_msg})
        // return res.redirect('/auth/login')
    }

});


// logout
router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err)throw err;
        res.redirect('/')
    })
})




module.exports=router
module.exports.uzer = this.uzer
// module.exports.isadmin=isadmin
// module.exports.requireAuth = requireAuth
// module.exports.authenticateToken = authenticateToken


// const generateAuthToken = () => {
//     return crypto.randomBytes(30).toString('hex');
// }


