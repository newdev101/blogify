const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.js');
const Post = require('../models/blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userLayout = '../views/layouts/user';




//todo  %%%%%%%%%%  SIGNUP &  SIGNIN PAGE  %%%%%%%%%%%%%
router.get('/signin',async (req, res) => {

    const locals = {
        title: 'Signin',
        description: "it's the User page"
    };

    try{
        res.render('user/signin',{locals, layout:userLayout});
    }catch(error){
        console.log(error.message);
    }

});


router.get('/signup',async (req, res) => {

    const locals = {
        title: 'Signup',
        description: "it's the User page"
    };

    try{
        res.render('user/signup',{locals, layout:userLayout});
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
           return res.redirect("/user/signin");
         }catch(error){
           if(error.code === 11000){
                res.status(409).json({message:'user already exist'});
           }
           res.status(500).json("enternal server error");
         }
 
         return res.redirect('/user/signin');
     }catch(error){
         console.log(error.message);
     }
 
 });



//todo  %%%%%%%%%%  SIGNIN API  %%%%%%%%%%%%%

router.post('/signin',async (req, res) => {

    const locals = {
        title: 'Signin',
        description: "it's the User page",
        warning: 1
    };

   
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            res.render('user/signin',{locals, layout:userLayout});
            // return res.status(401).json({message:'invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            res.render('user/signin',{locals, layout:userLayout});
            // return res.status(401).json({message:'invalid credentials'});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET);
        res.cookie('blogify-token',token,{httpOnly:true});
        res.redirect('/user/dashboard')


    }catch(error){
        console.log(error.message);
    }

});



//todo%%%%%%%%%%  Dashboard page  %%%%%%%%%%%%%
router.get('/dashboard',authMiddleware,async (req,res)=>{
    const locals = {
        title: 'Dashboard',
        description: "it's Dashboard page"
    };

    try{
        const data = await Post.find({createdBy:req.userId});
        res.render('user/dashboard',{locals, data, layout:userLayout});
    }catch(error){
        console.log(error.message);
    }
})



//todo%%%%%%%%%%  user logout  %%%%%%%%%%%%%
router.get('/logout',authMiddleware,async (req,res)=>{
    res.clearCookie('blogify-token');
    res.redirect('/user/signin');
})





module.exports = router;
