const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    products:[{productsId:{type:String}}]
    
},
{timestamps:true}
)

module.exports = mongoose.model('Cart', CartSchema)