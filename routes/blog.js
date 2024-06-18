const express = require('express');
const router = express.Router();
const upload = require('../middleware/util.js');
const authMiddleware = require('../middleware/auth.js');
const Blog = require('../models/blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userLayout = '../views/layouts/user';



//! Middleware



//todo  %%%%%%%%%%  ADD NEW BLOG PAGE  %%%%%%%%%%%%%
router.get('/add-blog',async (req,res)=>{
     const locals = {
         title: 'Add Blog',
         description: "it's Add post page"
     };
 
     try{

         res.render('user/add-post',{
             locals, 
             layout:userLayout
         });
     }catch(error){
         console.log(error.message);
     }
 })
 
 
//todo  %%%%%%%%%%  ADD NEW BLOG (API)  %%%%%%%%%%%%%



 router.post('/add-blog',authMiddleware,upload.single('coverImage'),async (req,res)=>{
     
     try{

         const newBlog = new Blog({
             title:req.body.title,
             body:req.body.body,
             createdBy:req.userId,
             coverImageURL:req.file?`/uploads/${req.file.filename}`:"/images/default-avator.png",
         });
         await Blog.create(newBlog);
         res.redirect('/')
        
     }catch(error){
         console.log(error.message);
     }
 })
 
 
 router.get('/edit-post/:id',authMiddleware,async (req,res)=>{
    
     try{
         const locals = {
             title: 'Edit Blog',
             description: "it's Edit post page"
         };
 
 
 
         const data=await Blog.findOne({_id:req.params.id});
         res.render('admin/edit-post',{
             locals,
             data,
             layout:adminLayout
         });
 
     }catch(error){
         console.log(error.message);
     }
 })
 
 router.put('/edit-post/:id',authMiddleware,async (req,res)=>{
     const locals = {
         title: 'Edit Blog',
         description: "it's Edit post page"
     };
             console.log("new put request"+req.params.id);
     try{
         await Blog.findByIdAndUpdate(req.params.id,{
             title: req.body.title,
             body: req.body.body,
             updatedAt: Date.now()
         })
         console.log("edit successful");
         res.redirect('/edit-post/'+req.params.id);
 
     }catch(error){
         console.log("edit failed");
         console.log(error.message);
     }
 })
 
 
 
 router.delete('/delete-post/:id',authMiddleware,async (req,res)=>{
 
     try{
         await Blog.deleteOne({_id:req.params.id});
         res.redirect('/dashboard/');
 
     }catch(error){
         console.log(error.message);
     }
 })





module.exports = router;


