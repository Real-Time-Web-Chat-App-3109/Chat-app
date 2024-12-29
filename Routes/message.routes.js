import { Router } from "express";
import { getMessage, getUserForSidebar, sendMessage } from "../Controllers/message.controller.js";
import { auth } from "../Middleware/auth.middleware.js";
import { upload } from "../Config/Multer.js";
import GroupRoute from "./group.routes.js"
import { createGroup, getGroups } from "../Controllers/group.controller.js";

const router = Router();

router.get("/getUsers",auth,getUserForSidebar)

router.get("/getGroups",auth,getGroups);

router.post("/send/:id",upload.single("image"),auth,sendMessage);

router.post("/createGroup",auth,createGroup);

router.use("/groupMessage",GroupRoute);

router.get("/:id",auth,getMessage);

export default router;