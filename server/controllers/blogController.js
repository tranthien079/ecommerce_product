const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary');
const fs = require('fs');

const createBlog = asyncHandler(async (req, res) => {
    try {
      const { _id } = req.user;
      const data = {...req.body, author: _id}
        const newBlog = await Blog.create(data);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { _id } = req.user;
    validateMongoDbId(id)
    const data = {...req.body, author: _id}
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
          const blog = await Blog.findById(id);
  
          for (const image of blog.images) {
              await cloudinaryDeleteImg(image.public_id); 
          }
  
          const deleteBlog = await Blog.findByIdAndDelete(id);
          res.json(deleteBlog);
    } catch (error) {
      throw new Error(error); 
    }
})

const getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
  
    try {
        const findBlog = await Blog.findById(id).populate('author').populate('categoryId');
        const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
            $inc: { numViews: 1},
        },
        {
            new: true
        }
        ).populate('author').populate('categoryId');
        res.json(updateViews);
        console.log(updateViews)
    } catch (error) {
        throw new Error(error);
    }
})

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
      let query = Blog.find().populate('author');
      if (req.query.categoryId) {
          query = query.find({ categoryId: req.query.categoryId });
      }

      const getBlogs = await query;
      res.json(getBlogs);
  } catch (error) {
      throw new Error(error);
  }
});


const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);

    const user_id = req?.user?._id;

    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === user_id?.toString());

    if(alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { disLikes: user_id },
            isDisliked: false
        }, { new: true })
        res.json(blog)
    }

    if(isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: user_id },
            isLiked: false
        }, { new: true })
        res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: user_id },
            isLiked: true
        }, { new: true })
        res.json(blog)
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const user_id = req?.user?._id;

    const isDisLiked = blog?.isDisliked;
    
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === user_id?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: user_id },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: user_id },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: user_id },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });

  const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findBlog);
    } catch (error) {
      throw new Error(error);
    }
  });


module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getAllBlogs,
    likeBlog,
    dislikeBlog,
    uploadImages
}