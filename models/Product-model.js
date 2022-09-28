const mongoose = require('mongoose')
const path = require('path')
const modelBasePath = '/uploads/models'
const coverImagePath = 'uploads/coverImage'

const ProductSchema = new mongoose.Schema({
    title:{type:String, required:true},
    image:{type:String, required:true},
    coverImage:{type:String,required:true},
    category: {type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Category'},
    price: {type:Number, required:true},
    uploader:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    description:{type:String, required:true}
    
},
{timestamps:true}
)

ProductSchema.virtual('imagePath').get(function(){
    if(this.image !=null){
        return path.join('/',modelBasePath, this.image)
    }
})
ProductSchema.virtual('coverImagep').get(function(){
    if(this.coverImage !=null){
        return path.join('/',coverImagePath, this.coverImage)
    }
})


ProductSchema.virtual('id').get(function(){
    if(this.image !=null){
        return this.ObjectId 
        // return this.name
    }
})

module.exports = mongoose.model('Productmodel', ProductSchema)
module.exports.modelBasePath = modelBasePath