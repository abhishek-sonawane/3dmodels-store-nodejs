
//this file is for creating categories by the developer not to be used by anyone else

const Category = require('./models/Category')
const mongoose= require('mongoose')
mongoose.pluralize(null);

mongoose.connect('mongodb://127.0.0.1:27017/newdb')
.then(()=>console.log('connected to Database Successfully'))
.catch((err)=>{
    console.log(err)
})

let Name = ''

async function createC(Name) {
    const newitem = new Category({
        name:Name
    })
    const saveditem = await newitem.save()
    console.log(saveditem)
}


createC("free")


