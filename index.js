import express from "express"
import { config } from "dotenv";
import { ConnectDB } from "./Config/DBconnection.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoute from "./Routes/auth.routes.js"
import messageRoute from "./Routes/message.routes.js"
import { cloudinaryConnect } from "./Config/Cloudinary.js";
config();

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

const port = process.env.PORT || 8000;

app.get("/",(req,res)=>{return res.json({message:"welcome to chat app."})})


app.use("/api/auth",authRoute);
app.use("/api/message",messageRoute);

ConnectDB();
cloudinaryConnect();

app.listen(port,()=>{console.log("Server is running on port no ."+port)});