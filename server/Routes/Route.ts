import express, { Request, Response } from "express";
import Register from "../controller/auth/register";
import Login from "../controller/auth/login";
import AutoLogin from "../controller/auth/AutoLogin";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("server is running 🔥🔥🔥");
});

router.post("/register", Register);
router.post("/login", Login);
router.post("/autologin", AutoLogin);

export default router;
