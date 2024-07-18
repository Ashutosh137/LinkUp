import mongoose from "mongoose";
const conn = mongoose
  .connect(process.env.MONGODBURL || "")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err: Error) => console.log(err));
export default conn;
