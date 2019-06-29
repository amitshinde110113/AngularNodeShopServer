const express = require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const morgan = require ('morgan');
const app = express();

const productRoutes = require('./api/routes/products');
const userRoute = require('./api/routes/users');
const orderRoutes = require('./api/routes/order');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://amit_shinde:'+
process.env.MONGO_PW+
'@node-rest-shop-3odr0.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true
});
app.use(morgan('dev'));


app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/products',productRoutes);
app.use('/users',userRoute);

app.use('/order',orderRoutes);

app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404;
    next(error);
   
});

app.use((error,req,res,next)=>{
res.status(error.status || 500);
res.json({error:{message:error.message }});

});

    module.exports = app