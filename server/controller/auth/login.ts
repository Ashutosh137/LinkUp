import { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isPassMatch = await compare(password, user.password);
    if (!isPassMatch)
      return res.status(400).json({ message: "Password is incorrect" });
    else {
      const token = jwt.sign(
        { email: user.email, password: user.password, name: user.name },
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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export default Login;
