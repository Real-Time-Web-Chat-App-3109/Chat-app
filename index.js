import express from "express"
import { config } from "dotenv";
config();

const app = express();

const port = process.env.PORT || 8000;

app.get("/",(req,res)=>{return res.json({message:"welcome to chat app."})})

app.listen(port,()=>{console.log("Server is running on port no ."+port)});