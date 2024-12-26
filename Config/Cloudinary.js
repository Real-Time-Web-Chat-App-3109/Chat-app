import cloudinary from "cloudinary"
import dotenv from "dotenv"
dotenv.config();

const cloudinaryConnect=()=>{
    try{
        cloudinary.v2.config({
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_SECRET
        })
    } catch(err){
        console.log("error while configuring cloudinary.")
        console.error(err.message)
    }
}

export {cloudinaryConnect}