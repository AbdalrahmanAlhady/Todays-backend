import { where } from "sequelize";
import Friendship from "../../DBs/models/friendship.model.js";
import User from "../../DBs/models/user.model.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findByPk(id);
    if (user) {
      res.status(201).json({ user });
    }else{
      res.status(404).json({ message: 'user not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { first_friend, second_friend } = req.query;
    const friendship = new Friendship({ first_friend, second_friend });
    const savedFriendship = await friendship.save();
    if (savedFriendship) {
      res.status(201).json({ message: "friendship request sent" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const acceptFriendRequest = async (req, res) => {
  try {
    const { first_friend, second_friend } = req.query;
    const friendship = await Friendship.update(
      { status: "accepted" },
      { where: { first_friend, second_friend } }
    );
    if (friendship)
      res.status(200).json({ message: "friendship request accepted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const unfriend = async (req, res) => {
  try {
    const { firstUser, secondUser } = req.query;
    const friendship = await Friendship.deleteOne({ firstUser, secondUser });
    if (friendship) res.status(200).json({ friendship });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
