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
        console.log(id)
        console.log(followerId)
        const follower = await User.findById(followerId)

        if(user.following.includes(followerId)) {
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

export const addReview = async(req, res) => {
    try {
        const { 
            newReview, 
            reviewUser, 
            revieweeId,
            reviewerName
        } = req.body;

        const reviewObject = {
            "reviewUserID" : reviewUser,
            "review": newReview,
            "reviewName" : reviewerName
        }

        const user = await User.findById(revieweeId);

        if(!user) {
            return res.status(404).json("User not found");
        }

        const reviews = user.reviews || [];
        reviews.push(reviewObject);

        const updatedUser = await User.findByIdAndUpdate(
            revieweeId,
            {
                reviews: reviews
            },
            { new: true }
        )

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}
/* */

export const addNotification = async(req, res) => {
    const { 
        user_who_left_review,
        user_who_left_review_name,
        user_who_gets_review,
        review,
    } = req.body;

    const notificationObject = {
        "notificationUserID" : user_who_left_review,
        "notification": review,
        "notificationUserName" : user_who_left_review_name 
    }

    const user = await User.findById(user_who_gets_review);

    if(!user) {
        return res.status(404).json("User not found");
    }

    const notifications = user.notifications || [];
    notifications.push(notificationObject);

    const updatedUser = await User.findByIdAndUpdate(
        user_who_gets_review,
        {
            notifications: notifications
        },
        { new: true }
    )
    try {
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}
/* */