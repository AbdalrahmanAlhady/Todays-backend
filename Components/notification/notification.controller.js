import Notification from "../../DBs/models/notification.model.js";
import User from "../../DBs/models/user.model.js";

export const getUserNotification = async (req, res) => {
    try {
        let includables = [
            {
                model: User,
                as:'sender',
                attributes: ["id", "profileImg", "first_name", "last_name"],
            }]
        let {receiver_id} = req.params;
        let notifications = await Notification.findAndCountAll({where:{receiver_id},include:includables});
        if (notifications) {
            res.status(201).json({notifications});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const seenNotification = async (req, res) => {
    try {
        let {id,receiver_id} = req.params;
        const notificationNotSeen = await Notification.update({seen : true},{ where: {id, receiver_id} });

        if (notificationNotSeen) {
            res.status(201).json({
                message: "notification seen",
            });
        } else {
            res
                .status(400)
                .json({ message: "notification not seen!"});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
