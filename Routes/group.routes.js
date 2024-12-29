import { Router } from "express";
import { upload } from "../Config/Multer.js";
import { auth } from "../Middleware/auth.middleware.js";
import { fetchGroupMessage, sendGroupMessage } from "../Controllers/group.controller.js";

const router = Router();

router.post("/send/:id",upload.single("image"),auth,sendGroupMessage);

router.get("/getMessages/:id",auth,fetchGroupMessage);


export default router