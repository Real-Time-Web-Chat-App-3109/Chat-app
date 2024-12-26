import express from "express"
import { config } from "dotenv";
import { ConnectDB } from "./Config/DBconnection.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
config();

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

const port = process.env.PORT || 8000;

app.get("/",(req,res)=>{return res.json({message:"welcome to chat app."})})

ConnectDB();

app.listen(port,()=>{console.log("Server is running on port no ."+port)});