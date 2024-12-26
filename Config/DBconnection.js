import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function ConnectDB()
{
    try{
        const connectedHost = await mongoose.connect(`${process.env.DATABASE_URL}`);
        if(connectedHost){
            console.log("Database is successfully connected to host "+connectedHost.connection.host);
        }
    }
    catch(error){
        console.log("Somthing went wrong while connecting database");
        console.log(error);
    }
}

export {ConnectDB};