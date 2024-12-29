import { User } from "../Models/user.model.js";
import { Message } from "../Models/message.model.js";
import { createPostCloudinary } from "../Utility/Cloudinary.utility.js";
import fs from "fs";
import { getReceiverSocketId } from "../Utility/Socket.js";
import { io } from "../Utility/Socket.js";

export const getUserForSidebar = async (req, res) => {

  const userId = req.user._id;

  try {
    const data = await User.find({_id:{ $ne: userId }}).select("-password");
    if (!data)
      return res
        .status(500)
        .json({ success: false, message: "data not found" });

    return res.status(200).json({ success: true, message: "data found", data });
  } catch (error) {
    console.log("somthing went wrong while getting sidebar data");
    console.log(error);
  }
};

export const getMessage = async (req,res)=>{

    const otherUserId = req.params.id;

    if(!otherUserId) return res.status(404).json({success:false,message:"other person userid not found."});

    const userId = req.user._id;

    try {
        const message = await Message.find({
            $or:[{senderId:userId,receiverId:otherUserId},{senderId:otherUserId,receiverId:userId}]
        })

        if(!message) return res.status(500).json({success:false,message:"no message found."});

        return res.status(200).json({success:true,message:"messages found successfully.",data:message});
    } catch (error) {
        console.log("something went wrong while fetching data. "+error.message);
        return res.status(500).json({success:false,message:"something  went wrong."});
    }

}


export const sendMessage = async (req,res)=>{

    const {text} = req.body;
    const receiverId =  req.params.id;

    const file = req.file;


    if(!receiverId) return res.status(404).json({success:false,message:"receiverId not found."});

    const senderId = req.user._id;

    try {
        let message = {
            senderId,
            receiverId,
        }

        if(text) message.text=text;

        if(file)
        {
            const supportedType = ["mp4", "mov", "jpg", "jpeg", "png"]
            const fileType = file.originalname.split('.')[1]
            if (!supportedType.includes(fileType)) {
                return res.status(400).json({
                    success: false,
                    message: "file type not supported."
                })
            }

            const postSize = file.size
            const maxSize = 2097152
            if (postSize > maxSize) {
                return res.status(413).json({
                    success: false,
                    message: "file size is too large."
                })
            }
            const response = await createPostCloudinary(file, "message image - chat app")

            if (!response) {
                return res.status(500).json({
                    success: false,
                    message: "error while uploading Post."
                })
            }
            
            message.image =response.secure_url;
            message.cloudinaryId=response.public_id;
        }

        const savedMessage = await Message.create(message);

        if(!savedMessage) return res.status(500).json({success:false,message:"Somthing went wrong while saveing message."});

        

        const receiverSocketId = getReceiverSocketId(receiverId);


        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage",savedMessage);
        }

        return res.status(200).json({success:true,message:"message saved successfully.",data:savedMessage});
    } catch (error) {
        console.log("Somthing went wrong while sending message.");

        return res.status(500).json({success:false,message:error.message});
    }
    finally
    {
        if(file) fs.unlinkSync(file.path);
    }

}