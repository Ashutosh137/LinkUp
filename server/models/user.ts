import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("user", UserSchema);

export default User;
