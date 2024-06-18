const express = require('express');
const router = express.Router();

const Post = require('../models/blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userLayout = '../views/layouts/user';



//! Middleware

const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'unauthorized'});
    }
    try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
    }catch(error){
            res.status(401).json({message:'unauthorized'});
    }
}



//todo  %%%%%%%%%%  SIGNUP &  LOGIN PAGE  %%%%%%%%%%%%%
router.get('/',async (req, res) => {

    const locals = {
        title: 'User',
        description: "it's the User page"
    };

    try{
        res.render('user/index',{locals, layout:userLayout});
    }catch(error){
        console.log(error.message);
    }

});


//todo  %%%%%%%%%%  SIGNUP API  %%%%%%%%%%%%%
router.post('/signup',async (req, res) => {
   
     try{
         const {username,email,password} = req.body;
         const hashedPassword = await bcrypt.hash(password,10);
 
         try{
           const user = await User.create({username,email,password:hashedPassword})
           return res.redirect("/");
         }catch(error){
           if(error.code === 11000){
                res.status(409).json({message:'user already exist'});
           }
           res.status(500).json("enternal server error");
         }
 
         return res.redirect('/user');
     }catch(error){
         console.log(error.message);
     }
 
 });

//todo  %%%%%%%%%%  SIGNIN API  %%%%%%%%%%%%%

router.post('/signin',async (req, res) => {
   
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message:'invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'invalid credentials'});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/')


    }catch(error){
        console.log(error.message);
    }

});


router.get('/dashboard',authMiddleware,async (req,res)=>{
    const locals = {
        title: 'Dashboard',
        description: "it's Dashboard page"
    };

    try{
        const data = await Post.find();
        res.render('admin/dashboard',{locals, data, layout:adminLayout});
    }catch(error){
        console.log(error.message);
    }
})




router.get('/logout',authMiddleware,async (req,res)=>{
    res.clearCookie('token');
    res.redirect('/admin');
})





module.exports = router;
