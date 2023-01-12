import Post from '../models/postsDb.js'
import User from '../models/usersDb.js';


/* CREATE */
export const createPost = async (req, res) => {
    try {
      const {
        title,
        userId, 
        description,
        picturePath,
        price,
        } = req.body;
      const user = await User.findById(userId);
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
export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        const post = await Post.findById(id)
        const isLiked = post.likes.get(userId)
        if ( isLiked){
            post.likes.delete(userId)
        }else{
            post.likes.set(userId, true)
        }
        const updatedPost = await Post.findByIdAndUpdate(id,
            {likes: post.likes},
            {new: true})
        return res.status(200).json(updatedPost)
    } catch (error) {
        return res.status(404).json(error.message)
    }
}


export const deletePost = async (req, res) => {
    try {
        const retrievedPost = await post.findOneAndDelete(req.params._id)
        return res.status(200).json(retrievedPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const retrievedPost = await post.findById(req.params.id)
        return res.status(200).json(retrievedPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}