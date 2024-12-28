import { Router } from "express";
import { getMessage, getUserForSidebar, sendMessage } from "../Controllers/message.controller.js";
import { auth } from "../Middleware/auth.middleware.js";
import { upload } from "../Config/Multer.js";

const router = Router();

router.get("/getUsers",auth,getUserForSidebar)

router.get("/:id",auth,getMessage);

router.post("/send/:id",upload.single("image"),auth,sendMessage);

export default router;