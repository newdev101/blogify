const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
     const token = req.cookies.token;

     console.log("token"+token)
     if(!token){
         return res.status(401).json({message:'unauthorized'});
     }
     try{
            console.log("jwt checked")
             const decoded = jwt.verify(token,process.env.JWT_SECRET);
             console.log("decoded"+decoded);
             req.userId = decoded.userId;
             next();
     }catch(error){
                console.log("jwt error")
                console.log(error.message);     
             res.status(401).json({message:'unauthorized'});
     }
 }

 module.exports = authMiddleware;