import { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.PUBLIC_Client);

const GoogleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.PUBLIC_Client,
    });

    const payload = ticket.getPayload();
    const user = await User.findOne({ email: payload.email,signin:"google" });
    if (!user) return res.status(400).json({ message: "User not found" });
    else {
      const token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET || "123",
        {
          expiresIn: "3 days",
        }
      );
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000 * 24 * 3,
        })
        .status(200)
        .json({ message: "Login Successfully", token });
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};

export default GoogleLogin;
