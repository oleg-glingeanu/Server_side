import Post from '../models/postsDb.js'
import User from '../models/usersDb.js';
import { addDays } from 'date-fns';

/* CREATE */
export const createPost = async (req, res) => {
    try {
      const {
        title,
        userId,
        picturePath,
        description,
        price,
        postDays,
        } = req.body;
      console.log(req.body);
      const user = await User.findById(userId);
      const currentDate = new Date();
      const expiryDate = addDays(currentDate, postDays);
      const newPost = new Post({
        title,
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        price,
        likes: {},
        endTime: expiryDate,
        comments: [],
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };
  
/* READ */
export const getPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();
        return res.status(200).json(allPosts)
    } catch(error) {
        return res.status(404).json(error.message)
    }
}

export const getPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        return res.status(200).json(post)
    } catch (error) {
        return res.status(404).json(error.message)
    }
}

/* UPDATE */
export const updateBid = async (req, res) => {
    try {
        const { newBid } = req.body;
        const { id } = req.params;
        console.log(req.body);
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { currentBid:newBid},
            { new: true }
        );
        return res.status(200).json(updatedPost);
    }
    catch{
        return res.status(404).json(error.message);
    }
}


export const deletePost = async (req, res) => {
    try {
        console.log(req.params)
        const retrievedPost = await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json(retrievedPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({userId})
        res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const checkExpiry = async (req, res) => {
    try {
        const posts = await Post.find()
        const now = new Date();
        console.log(now);
        for (const element of posts) {
            
            console.log("---------------------------------------");
            console.log("Item name: ", element.title)
            console.log("Item Date made:", element.createdAt);
            console.log("Item Date Epiry:", element.endTime);

            if(now<element.endTime){
                console.log("This POST has not yet expired")
            }else{
                console.log("This Post has expired")
               await Post.findByIdAndDelete(element.id)
            }
            console.log("---------------------------------------");
        }
    } catch (error) {
        console.log(error)
    }
}