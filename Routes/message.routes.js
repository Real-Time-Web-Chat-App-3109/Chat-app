import { Router } from "express";
import { getMessage, getUserForSidebar, sendMessage } from "../Controllers/message.controller.js";
import { auth } from "../Middleware/auth.middleware.js";

const router = Router();

router.get("/getUsers",auth,getUserForSidebar)

router.get("/:id",auth,getMessage);

router.post("/sendMessage",auth,sendMessage);

export default router;