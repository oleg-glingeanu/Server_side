import express  from "express";
import { getUser, getFollowing, addRemoveFollowing} from '../Controllers/users.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

/* READ */
router.get('/:id',getUser)
router.get('/:id/following', verifyToken, getFollowing)

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFollowing)

export default router