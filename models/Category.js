const { type } = require('express/lib/response')
const mongoose = require('mongoose')
mongoose.pluralize(null);

const CategorySchema = new mongoose.Schema({
    name :{type:String}
})

module.exports = mongoose.model('Category', CategorySchema)