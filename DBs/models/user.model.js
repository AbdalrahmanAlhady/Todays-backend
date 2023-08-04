import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "firstName is required"],
      min: [3, "minimum length 3 char"],
      max: [20, "max length 20 char"],
    },
    last_name: {
      type: String,
      min: [3, "minimum length 3 char"],
      max: [20, "max length 20 char"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: [true, "phone must be unique value"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "userName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [10, "minimum length 10 char for password"],
    },
    birthdate: {
      type: Date,
      required: [true, "birthdate is required"],
    },
    img: {
      type: String,
    },
    OTP:{
      type:String
    }
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;