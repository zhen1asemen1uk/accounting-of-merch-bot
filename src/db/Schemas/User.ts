import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: String, // String is shorthand for {type: String}
    fullName: String,
    telegram_id: String,
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
