import mongoose from "mongoose";
const { Schema } = mongoose;

const friendshipSchema = new Schema(
  {
    firstUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "invaild user id "],
    },
    secondUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "invaild user id "],
    },
    status:{
        type:String,
        enum:['requested','accepted'],
        default: 'requested'
    }
  },
  { timestamps: true }
);
const Friendship= mongoose.model("Friendship", friendshipSchema);
export default Friendship