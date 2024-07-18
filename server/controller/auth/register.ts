import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user";
const Register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const hashedpass = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const user = await User.create({ email, name, password: hashedpass });
    user.save();
    res.json({ message: "registed Sucussfully" });
  } catch {
    res.status(409).json({ message: "registed Failed" });
  }
};

export default Register;
