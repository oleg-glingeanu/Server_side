import express  from "express";
import { getPosts, getPost, deletePost, getUserPosts, createPost } from '../Controllers/postController.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost )
router.get('/:userId/posts', verifyToken, getUserPosts )
router.delete('/:id', deletePost)

export default router