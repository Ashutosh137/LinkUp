import mongoose from "mongoose";
const conn = mongoose
  .connect(
    "mongodb+srv://mrluckysharma7:iljWiGsQC85He8mH@cluster0.utcclde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err: Error) => console.log(err));

export default conn;
