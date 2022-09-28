const express = require('express')
const router = express.Router();
require('dotenv').config();
const Productmodel = require('../models/Product-model');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY )


router.use(express.json())
router.get('/',(req,res)=>{
    res.send('hello')
})


router.post('/', async (req,res)=>{
    try {
        const itemz = req.body.id
        console.log(itemz)
        const quan = req.body.quantity
        const title = req.body.title
        const price = req.body.price
        const storeItem =await Productmodel.findById(itemz)
        const pricefinal = storeItem.price*100
        // console.log(storeItem.title)

         const session = await stripe.checkout.sessions.create({
             payment_method_types:['card'],
             mode:'payment',
             
               line_items:[
                   {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: storeItem.title,
                    },
                    unit_amount:pricefinal,
                  },
                  quantity: 1,
                
                }
                ],
            
             success_url:`http://localhost:5000/catalogue/details/download/confirm/${itemz}`,
             cancel_url:`http://localhost:5000/catalogue` ,

        })
        res.json({url:session.url})
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})



// router.get('catalogue/details/download/confirm/:id',async(req,res)=>{
//     const prod = await Productmodel.findById(req.params.id)
//     var patth = `./public/uploads/models/${prod.image}`
//     return res.download(patth)
// })



module.exports = router



// line_items: [
//     {
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: 'T-shirt',
//         },
//         unit_amount: 2000,
//       },
//       quantity: 1,
//     },
//   ],