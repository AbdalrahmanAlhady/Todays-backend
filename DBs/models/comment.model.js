import mongoose from "mongoose";
const { Schema } = mongoose;
const commentSchema = new Schema(
  {
    body: {
      type: String,
      min: [true, "can't create empty comment "],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "invaild user id "],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "invaild post id "],
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment