require('dotenv').config()
const express = require('express')
const router = express.Router();
const User = require('../models/User')
const path = require('path')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const cookieParser = require('cookie-parser');


const bodyParser = require('body-parser');
const { stat } = require('fs');
router.use(cookieParser());

router.use(express.urlencoded({extended:false}))

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
        // err_msg = "This user already exists.";
        //     return res.render('../views/login/register', { err_msg: err_msg } );
        return res.send('user already exist') 
    }

    if(existemail){
        return res.send('mail already exist') 
    }
    
    const newUser =   new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const savedUser = await newUser.save();
        // res.status(201).json(savedUser);
        res.redirect('/auth/login')
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
        const err_msg = 'no such user found'
      return  res.render("../views/login/login",{err_msg:err_msg})

    }

    

    try{
    // !user && res.status(401).json("wrong credentials")
    // reqpassword !== req.body.password &&
    //     res.status(401).json("wrong credentials");
    if(req.body.password == user.password){
                            const username = req.body.username;
                            const pass = req.body.password;
                            const uzer = {name:username,passw:pass}
                            // const accesstoken = jwt.sign(uzer,process.env.ACCESS_TOKEN)
                            // res.set({
                            //     'content-type': 'application/json',
                            //     'authorization':  `bearer ${accesstoken}`
                            // })
                            // return res.json({accesstoken:accesstoken})
    
            // const state = await User.updateOne({username:req.body.username},{"$set":{"isLoggedin":true}}).then(dbModel => res.json(dbModel))
            // .catch(err => res.status(422).json(err));;
            // console.log(state)
            // const authToken = generateAuthToken();
            // authTokens[authToken] = uzer;
            // res.cookie('AuthToken', authToken);

            // console.log(uzer)
            if(username == 'admin'){
                req.session.isAdmin = true;
            }
            req.session.isAuth = true;
            
        return res.redirect('/catalogue')
    }
    // const reqpassword =  user.password;
    // const {password, ...others} = user._doc;
    // console.log(reqpassword)
    else {
        
    return res.status(401).sendFile(path.join(__dirname,'../L.jpg'))
    }
    // res.status(200).json(others)
   
    }catch(err){
        console.log(err)
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


