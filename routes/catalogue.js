const express = require('express');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const auth = require('./auth')
const cookieParser = require('cookie-parser');
const router = express.Router();
const User = require('../models/User')
const Productmodel = require('../models/Product-model');
const { query } = require('express');
const { diskStorage } = require('multer');
const { error } = require('console');
const uploadPath = path.join('public'+Productmodel.modelBasePath)
const modelMimeType = ['model/gltf-binary','model/gltf-json','application/gltf-buffer','3D-Object/glb','model/glb','image/jpeg','image/png']
router.use(cookieParser());
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
require('dotenv').config()

const stripeSecretKey = process.env.STRIPE_PRIVATE_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY


//multer storage 

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        // callback(null,uploadPath);
        const dir1 = "public/uploads/coverImage";
        if(file.fieldname ==='coverImage'){
            cb(null,dir1)
        }
        else if(file.fieldname==='model'){
            cb(null,uploadPath)
        }
    },
    // fileFilter:(req,file,callback)=>{
    //     callback(null,modelMimeType.includes(file.mimetype))
    // },
    filename: function(req, file, callback) {
        callback(null, Date.now()+ file.originalname);
      }
})

const upload = multer({
    storage:storage
})

// var dest = destination :function(req,file,cb){const dir1 :'public/uploads/coverImage',
// const dir2 = path,
// if(file.fieldname ==='coverimage'){
//     cb(null,dir2)
// }
// }





//get specific
router.get('/details/:id', async (req,res)=>{

    try {
        let parmid = req.params.id
        let parm = await Productmodel.findById(parmid)
        let tit = parm.title
        let pathe = parm.imagePath
        let coverimg = parm.coverImagep
        let cate = parm.category
         res.render('details', {tit:tit,image:pathe,coverimg:coverimg,parm:parm,id:parmid,cate:cate})
        
    } catch (error) {
        // res.send('<h1>aha wrong route buddy!  try harder next time</h1>')
        res.sendFile(path.join(__dirname,'../forbidden.jpg'))
    }
})


//stripe checkoutpage 

router.get('/details/download/:id',async (req,res)=>{
    try {
        let parme = await Productmodel.findById(req.params.id)
        let id = parme.id;
        let name = parme.title;
        let price = parme.price;
        let image = parme.imagePath;
        let coverimg = parme.coverImagep;
        let data = {id ,name,price,image,coverimg}
        // let path = `./public/uploads/models/${parme.image}`
        //   return res.download(path)
        return res.render('cart',{data:data,
            stripePublicKey:stripePublicKey
        })
    
        

        
    } catch (error) {
        console.log(error)
        res.sendFile(path.join(__dirname,'../forbidden.jpg'))
        
    }

 
})


//redirected download page after success
router.get('/details/download/confirm/:id',async(req,res)=>{
    const prod = await Productmodel.findById(req.params.id)
    var patth = `./public/uploads/models/${prod.image}`
    return res.download(patth)
})




//get all 3d-models
router.get('/', async(req,res)=>{
    let query = Productmodel.find()
    if(req.query.title != null && req.query.title != ""){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    try{
        const models = await query.exec()
        res.render("../views/catalogue",{
            models : models,
            searchOptions:req.query
        })

    }catch{
        res.redirect('/')
    }
    
})

const isAdmin = (req,res,next)=>{
    if(req.session.isAdmin){
        next()
    }else{
        res.redirect('/')
    }
}




//upload a 3d-model (get req)
router.get('/upload',isAdmin, async(req,res)=>{
    
        renderUploadPage(res, new Productmodel())
        // res.send('success')

    
})



//upload a 3d-model (post req)
router.post('/upload',upload.fields([{name:"coverImage",maxCount:1},{name:"model",maxCount:1}])
,async(req,res)=>{
    const modelFile = req.files.model != null ?req.files.model[0].filename : null
    const coverFile = req.files.coverImage != null ?req.files.coverImage[0].filename : null

    const productmodel = new Productmodel({
        title: req.body.title,
        category:req.body.category,
        price:req.body.price,
        description:req.body.description,
        image:modelFile,
        coverImage:coverFile,
    })
    try {
        const newModel = await productmodel.save()
        res.redirect('/catalogue')
        
    } catch (err) {
        if (productmodel.image != null){
            removeModel(productmodel.image)
        }
        if(productmodel.coverImage !=null){
            removeModel(productmodel.coverImage)
        }
        renderUploadPage(res, productmodel, true)
        console.log(err)
        
    }

})



async function renderUploadPage(res,productmodel,hasError = false){
    try {
        const category = await Category.find({})
        const params = {
                category:category,
                productmodel:productmodel
             }
             if(hasError)params.errorMessage = 'error creating book'||console.log(error)
            res.render('../views/new_model',params)
         } catch {
            res.redirect('/')
            }
}



function removeModel(fileName){
    fs.unlink(path.join(uploadPath , fileName), err =>{
        if(err) console.error(err)
    })

}






//stripe and cart implementation





module.exports = router;
module.exports.pathe = this.pathe;
