import express, { Request, Response } from "express";
import Register from "../controller/auth/register";
import Login from "../controller/auth/login";
import AutoLogin from "../controller/auth/AutoLogin";
import GoogleLogin from "../controller/auth/googleLogin";
import GoogleRegister from "../controller/auth/GoogleRegister";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("server is running 🔥🔥🔥");
});

router.post("/register", Register);
router.post("/login", Login);
router.post("/autologin", AutoLogin);
router.post("/google/login", GoogleLogin);
router.post("/google/register", GoogleRegister);

export default router;
