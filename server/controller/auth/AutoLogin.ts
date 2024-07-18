import { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";

const AutoLogin = async (req: Request, res: Response) => {
//   const { token } = req.body;
  const {token}=req.headers
  const Jwt_token=String(token).replace("Bear ","")
  console.log(Jwt_token)
  try {
  
    const decoded = jwt.verify(Jwt_token, process.env.JWT_SECRET as string || "123");
    if (typeof decoded === "string" || !("email" in decoded)) {
        return res.status(400).json({ error: "Invalid token payload" });
      }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Server error" });
  }
};

export default AutoLogin;
