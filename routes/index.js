const express = require('express')  
const router = express.Router()


//main page (get /)

router.get('/', (req,res)=>{
    res.render('../views/index')
})

//dashboard admin page 
router.get('/admin',(req,res)=>{
    res.send('admin dashboard')
})

// about page

router.get('/about',(req,res)=>{
    res.render('about',{title:'about'})
})

module.exports = router