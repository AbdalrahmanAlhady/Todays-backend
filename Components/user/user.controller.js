import Friendship from "../../DBs/models/friendship.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { firstUser, secondUser } = req.query;
    const friendship = new Friendship({ firstUser, secondUser });
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
    const { firstUser, secondUser } = req.query;
    const friendship =await Friendship.findOneAndUpdate(
      { firstUser, secondUser },
      { $set: { status: "accepted" } },
      { new: true }
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
