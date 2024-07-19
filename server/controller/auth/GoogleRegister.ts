import { Request, Response } from "express";
import User from "../../models/user";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.PUBLIC_Client);

const GoogleRegister = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.PUBLIC_Client,
    });

    const payload = ticket.getPayload();
    const alreadyExist = await User.findOne({ email: payload.email });

    if (alreadyExist) {
      return res.status(403).json({ message: "user already exist" });
    } 
    else {
      const user = await User.create({
        email: payload.email,
        name: payload.name,
        signin: "google",
      });

      console.log(user);
      user.save();
      res.json({ message: "registed Sucussfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: "registed Failed" });
  }
};

export default GoogleRegister;
