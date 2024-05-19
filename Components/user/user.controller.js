import {where} from "sequelize";
import Friendship from "../../DBs/models/friendship.model.js";
import User from "../../DBs/models/user.model.js";
import {notifyUserBySocket} from "../../service/socket-io.js";

export const getUser = async (req, res) => {
    try {
        const {id} = req.query;
        const user = await User.findByPk(id);
        if (user) {
            res.status(201).json({user});
        } else {
            res.status(404).json({message: "user not found"});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};
export const sendFriendRequest = async (req, res) => {
    try {
        const {sender_id, receiver_id} = req.body;
        const friendship = await Friendship.create({sender_id, receiver_id});
        if (friendship) {
            await notifyUserBySocket('has sent friend request to you', sender_id, receiver_id, 'friendship_request',null,null,friendship.id)
            res.status(201).json({message: "sent"});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};
export const acceptFriendRequest = async (req, res) => {
    try {
        //  receriver is the one who will accept request so he is sender now
        const {sender_id, receiver_id} = req.query;;
        const friendship = await Friendship.update(
            {status: "accepted"},
            {where: {sender_id, receiver_id}}
        );
        if (friendship){
            await notifyUserBySocket('has accepted your friend request',  sender_id, receiver_id,'friendship_accept',null,null,friendship.id)
            res.status(200).json({message: "accepted"});}
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};
export const unfriendOrDeclineFriendRequest = async (req, res) => {
    try {
        const {sender_id, receiver_id} = req.query;
        const friendship = await Friendship.deleteOne({sender_id, receiver_id});
        if (friendship) res.status(200).json({message:'friendship removed'});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};
export const checkFriendship = async (req, res) => {
    try {
        const {sender_id, receiver_id}= req.query;
        const friendship = await Friendship.findOne({
            where: {sender_id, receiver_id},
        });
        if (friendship) {
            res.status(201).json({friendship_status: friendship.status});
        } else {
            res.status(201).json({friendship_status: 'none'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error.message});
    }
};
