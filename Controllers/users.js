import User from "../models/usersDb.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ error: error.message})
    }
}

export const getFollowing = async (req, res) => {
    try {
        const {id} = req.params
        const user = await User.findById(id);
        const following = await Promise.all(
            user.following.map((id) =>  User.findById(id))
        )
        const formattedFollowing = following.map(
            ({_id, firstName, lastName, picturePath }) => {
                return {_id, firstName, lastName, picturePath }
            }
        )
        res.status(200).json(formattedFollowing)

    } catch (error) {
        res.status(404).json({ error: error.message})
    }
}

/* Update */
export const addRemoveFollowing = async (req, res) => {
    try {
        const {id, followerId} = req.params
        const user = await User.findById(id)
        const follower = await User.findById(followerId)

        if(user.following.includes(followingId)) {
            user.following = user.following.filter((id) => id !== followerId)
            follower.following = follower.following.filter((id) => id !== id)
        }else{
            user.following.push(followerId)
            follower.following.push(id)
        }
        await user.save()
        await follower.save()

        const following = await Promise.all(
            user.following.map((id) =>  User.findById(id))
        )
        const formattedFollowing = following.map(
            ({_id, firstName, lastName, picturePath }) => {
                return {_id, firstName, lastName, picturePath }
            }
        )
        res.status(200).json(formattedFollowing)
    } catch (error) {
        res.status(404).json({ error: error.message})
    }
}
/* */