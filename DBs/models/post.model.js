import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    body: {
      type: String,
      min: [true, "can't create empty post "],
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "invaild user id "],
    },
   
  },
  { timestamps: true }
);
const Post = mongoose.model('Post',postSchema);
export default Post;