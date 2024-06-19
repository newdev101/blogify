const express = require('express');
const router = express.Router();
const upload = require('../middleware/util.js');
const authMiddleware = require('../middleware/auth.js');
const Blog = require('../models/blog');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userLayout = '../views/layouts/user';




//todo  %%%%%%%%%%  ADD NEW BLOG PAGE  %%%%%%%%%%%%%
router.get('/add-blog',authMiddleware,async (req,res)=>{
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
             coverImageURL:req.file?`/uploads/${req.file.filename}`:"/images/default-blog.jpg",
         });


         await Blog.create(newBlog);
         res.redirect('/')
        
     }catch(error){
         console.log(error.message);
     }
 })

//todo  %%%%%%%%%%  show BLOG  %%%%%%%%%%%%%
router.get('/:id',async (req,res)=>{
    
    try{

        const data=await Blog.findOne({_id:req.params.id});
        let created_by = await User.findOne({_id:data.createdBy});
        created_by = created_by.username;
        console.log("data "+data);
        console.log("created_by "+created_by);
        const locals = {
            title: data.title,
            description: "it's Blog page"
        };

        res.render('blog',{
            locals,
            data,
            created_by
        });

    }catch(error){
        console.log(error.message);
    }
})

 
//todo  %%%%%%%%%%  EDIT BLOG page  %%%%%%%%%%%%%
 router.get('/edit-blog/:id',authMiddleware,async (req,res)=>{
    
     try{
         const locals = {
             title: 'Edit Blog',
             description: "it's Edit post page"
         };
         const data=await Blog.findOne({_id:req.params.id});
         res.render('user/edit-blog',{
             locals,
             data,
             layout:userLayout
         });
 
     }catch(error){
         console.log(error.message);
     }
 })


//todo  %%%%%%%%%%  edit BLOG (api)  %%%%%%%%%%%%%
 router.put('/edit-blog/:id',authMiddleware,async (req,res)=>{
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
         res.redirect('/blog/edit-blog/'+req.params.id);
 
     }catch(error){
         console.log("edit failed");
         console.log(error.message);
     }
 })
 
 
//todo  %%%%%%%%%%  DELETE BLOG (API)  %%%%%%%%%%%%%
 router.delete('/delete-blog/:id',authMiddleware,async (req,res)=>{
     try{
         await Blog.deleteOne({_id:req.params.id});
         res.redirect('/user/dashboard/');
 
     }catch(error){
         console.log(error.message);
         res.redirect('/user/dashboard/');
     }
 })





module.exports = router;


