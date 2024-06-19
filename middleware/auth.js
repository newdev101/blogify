const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const token = req.cookies['blogify-token'];

     
     if(!token){
       
         res.redirect('/user/signin');
     }
     try{
            
             const decoded = jwt.verify(token,process.env.JWT_SECRET);
             req.userId = decoded.userId;
             next();
     }catch(error){
                console.log(error.message);     
             res.redirect('/user/signin');
     }
 }

 module.exports = authMiddleware;