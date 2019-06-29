const express = require('express');
const mongoose=require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/product');
const router= express.Router();
const checkAuth=require('../middelware/check-auth');


router.get('/',(req,res,next)=>{

    Order.find().select('product qty _id')
    .populate('product').exec()
    .then(result=>{
        
        const respose={
            count:result.length,
            data:result.map(result=>{
                return{
                    _id:result._id,
                    product:result.product,
                    qty:result.qty,
                    
                    request:'GET',
                        url:'http://localhost:3000/order/'+result._id,
                }
            }),
            
        }
        res.status(200).json({respose});
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/',checkAuth,(req,res,next)=>{

        


    const order=new Order({
             _id:mongoose.Types.ObjectId(),
             qty:req.body.qty,
             product:req.body.productId
    });

    order.save()
    .then(result=>{

            console.log(result);
            res.status(201).json({Message:'Order placed...',data:result});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
  
    

});



router.get('/:orderId',(req,res,next)=>{
const id=req.params.orderId;

Order.findById({_id:id}).select('product qty _id').populate('product').exec()
    .then(result=>{
        
        const respose={
            
            
                
                    product:result.product,
                    quantity:result.qty,
                    _id:result._id,
                    request:'GET',
                    url:'http://localhost:3000/order/',
              
                        
        }
        res.status(200).json({respose});
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});


router.patch('/:orderId', checkAuth ,(req,res,next)=>{
const id=req.params.orderId;

res.status(200).json({Messsage:'updated'});
});

router.delete('/:orderId',checkAuth,(req,res,next)=>{
    const id=req.params.orderId;
    Order.remove({ _id : id} )
    .select('product qty _id')
    .exec()
        .then(result=>{
            
           console.log(result);
            res.status(200).json({Messsage:'Order deleted'});
       
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });

});










module.exports = router;