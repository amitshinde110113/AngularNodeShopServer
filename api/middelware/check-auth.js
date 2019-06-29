const jwt= require('jsonwebtoken');


module.exports =(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
    const decodes = jwt.verify(token,process.env.jwt_key);
    req.userData=decodes;
    next();
    }catch(error){
        res.status(500).json({Message:"failed",  req:req.headers,
        res:res.headers,});
    }
};