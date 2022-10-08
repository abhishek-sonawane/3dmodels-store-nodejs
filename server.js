const express = require('express')
require('dotenv').config()
const path = require('path')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const session =require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config();
// const expressLayouts = require('express-ejs-layouts')
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY )

const mongouri = process.env.MONGODB_CONNECTION_URI

// mongodb connection from mongoose
mongoose.connect(mongouri)
.then(()=>console.log('connected to Database Successfully'))
.catch((err)=>{
    console.log(err)
})
var db = mongoose.connection
//session store
const store = new MongoDBStore({
    uri:process.env.MONGODB_CONNECTION_URI,
    collection:'userSessions',
    auto_reconnect:true
})

app.use(express.json())

app.use(
    cors({
      origin: "http://localhost:5000",
    })
  )


app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:false,
    store:store
}))
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });
app.listen(5000, ()=>{
    console.log("server started on port 5000...")
})

// layouts
// app.use(expressLayouts)
// setting view engine
// app.set('layout',path.join(__dirname,'views/layouts/header'))
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs')


// static folder for images,3dmodels,css,javascript (frontend)
app.use('/build/',express.static(path.join(__dirname,'/node_modules/three/build')));
app.use('/jsm/',express.static(path.join(__dirname,'/node_modules/three/examples/jsm')));
app.use( express.static( "public" ) );


// routes

//login and registration route
app.use('/auth', require('./routes/auth'))

//main page route
app.use('/', require('./routes/index'))
const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/auth/login')
    }
}

//all catalogue routes where 3d-models are stored 
app.use('/catalogue',isAuth, require('./routes/catalogue'))



app.use('/create-checkout-session',require('./routes/stripeCheckout'))


//stripe 

app.use(function(req,res){
    res.status(404).render('error')
})

// const storeItems = new Map([
//     [1, { priceInCents: 10000, name: "Learn React Today" }],
//     [2, { priceInCents: 20000, name: "Learn CSS Today" }],
//   ])
 

