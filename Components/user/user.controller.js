import {where} from "sequelize";
import Friendship from "../../DBs/models/friendship.model.js";
import User from "../../DBs/models/user.model.js";
import {notifyUserBySocket} from "../../service/socket-io.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(201).json({user});
        } else {
            res.status(404).json({message: "user not found"});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

