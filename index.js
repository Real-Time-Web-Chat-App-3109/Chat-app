import express from "express";
import { config } from "dotenv";
import { ConnectDB } from "./Config/DBconnection.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoute from "./Routes/auth.routes.js";
import messageRoute from "./Routes/message.routes.js";
import { cloudinaryConnect } from "./Config/Cloudinary.js";
import cors from "cors";
import { app, server } from "./Utility/Socket.js";
config();

// const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.182.20:5173"],
    credentials: true,
  })
);

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.json({ message: "welcome to chat app." });
});

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

ConnectDB();
cloudinaryConnect();

server.listen(port, () => {
  console.log("Server is running on port no. " + port);
});
