const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
     title:{
          type: String,
          required: true,
     },
     body:{
          type:String,
          required: true,
     },
     coverImageURL:{
          type: String,
          default: "/images/default-blog.jpg",
     },
     createdBy:{
          type: Schema.Types.ObjectId,
          ref: 'user',
     },
     createdAt:{
          type: Date,
          default: Date.now
     },
     updatedAt:{
          type: Date,
          default: Date.now
     }
});

const Blog = model('blog',blogSchema);

module.exports=Blog;