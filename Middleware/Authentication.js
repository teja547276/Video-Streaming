const jwt=require('jsonwebtoken');
//if user logged in and acces for their assets
const User=require('../Modals/User');

const auth=async (req,res,next)=>{

    const token=req.cookies.tokens; //this cookies.token is created at user.js controllers
    if(!token){
        return res.status(400).json({error:"No token,authorization denied"});

    }else{
        try{
    const decode=jwt.verify(token,'Its_My_Secret_Key');
    
    req.user=await User.findById(decode.userId).select('-password');//hiding password
    next();
        }catch(error){
             res.status(400).json({error:"Token is not valid"})
        }
    }
}
module.exports=auth;