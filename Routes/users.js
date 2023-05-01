import express  from "express";
import { getUser, getFollowing, addRemoveFollowing, addReview, addNotification} from '../Controllers/users.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

/* READ */
router.get('/:id',getUser)
router.get('/:id/following', verifyToken, getFollowing)
router.post('/:id/leaveReview', verifyToken, addReview)
router.post('/:id/addNotification', verifyToken, addNotification)
/* UPDATE */
router.patch("/:id/:followerId", verifyToken, addRemoveFollowing)

export default router