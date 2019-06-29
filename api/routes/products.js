const express = require('express');
const mongoose=require('mongoose');
const multer = require('multer');
const checkAuth=require('../middelware/check-auth');
const router= express.Router();
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('in name change');
       
        cb(null,'./uploads/');
 
    },
    filename:function(req,file,cb){
        var extension = file.mimetype;
    extension = extension.substring(extension.indexOf("/")+1, extension.length);
    console.log('in name change'); 
    var filename = file.originalname + '-' + Date.now() + "." + extension;
    console.log('in name change',filename);
    cb(null, filename);
            }
});
const upload = multer({storage:storage});
const Product = require('../models/product');



router.get('/',(req,res,next)=>{


    Product.find().select('name price _id productImage').exec()
    .then(result=>{
        
        const response={
            //count:result.length,
            data:result.map(result=>{
                return{
                    name:result.name,
                    price:result.price,
                    id:result._id,
                    img:'http://localhost:3000/'+result.productImage,
                  
                    request:'GET',
                        url:'http://localhost:3000/products/'+result._id,
                }
            }),
            
        }
        res.status(200).json({response:response});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });


        
});

router.post('/', checkAuth,upload.single('productImage'),(req,res,next)=>{
        console.log(req.file);
       

        const product=new Product({
            _id : new mongoose.Types.ObjectId(),

            name:req.body.name,
            price:req.body.price,
            productImage:req.file.path,
        });
        product.save()
        .then(result=>{
            const respose={
               
               
                   
                        name:result.name,
                        price:result.price,
                        _id:result._id,
                        request:'GET',
                            url:'http://localhost:3000/products/'+result._id,
                            imgUrl:'http://localhost:3000/products/'+result.productImage
                   
                
                
            }
            res.status(200).json({respose});
        })
        .catch(err=>{
            console.log(err);
        });

   
});



router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id).select('name price _id productImage').exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({data:result,request:'GET',Description:'Get All products list',url:'http://localhost:3000/products'});
    })
    .catch(err=>{
        console.log(err);
        res.status(200).json({error:err});
    });


    
});


router.patch('/:productId', checkAuth,(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const op of req.body)
    {
        updateOps[op.propName]=op.value;
    }
   Product.update({ _id : id},{$set:updateOps}).select('name price _id').exec()
    .then(result=>{
        console.log(result);
        if(result){
        res.status(200).json({
            Message:'Product is updated Successfully',
            request:'GET',
            url:'http://localhost:3000/products/'+result._id,
    });
        }
        else{  res.status(500).json({error:err});}
    })
    .catch(err=>{
        console.log(err);
        res.status(200).json({error:err});
    });


    
});

router.delete('/:productId', checkAuth ,(req,res,next)=>{

    const id=req.params.productId;
  if( (Product.findById(id) ) ) {
    Product.remove({ _id : id} ).select('name price _id').exec()
    .then(result=>{
        
        console.log(result);
        res.status(200).json({Messsage:'Product deleted'});
       
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });

        }else{ res.status(201).json({Message:'Not Exist',ID:id})}



    
});
module.exports = router;