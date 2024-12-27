import express from "express"
import { signup, login, logout, updateProfile, checkAuth } from "../Controllers/auth.controller.js";
import { auth } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile",auth,updateProfile);

router.get("/check", auth, checkAuth);

export default router;