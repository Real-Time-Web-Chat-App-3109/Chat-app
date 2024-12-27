import { User } from "../Models/user.model.js";
import { Message } from "../Models/message.model.js";
import { json } from "body-parser";

export const getUserForSidebar = async (req, res) => {

  const userId = req.user._id;

  try {
    const data = await User.find(userId, { $ne: userId }).select("-password");
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
            $or:[{senderId:userId,recieverId:otherUserId},{senderId:otherUserId,recieverId:userId}]
        })

        if(!message) return res.status(500).json({success:false,message:"no message found."});

        return res.status(200).json({success:true,message:"messages found successfully.",data:message});
    } catch (error) {
        console.log("something went wrong while fetching data. "+error.message);
        return res.status(500).json({success:false,message:"sonthing  went wrong."});
    }

}


export const sendMessage = async (req,res)=>{

    const {recieverId,text,image} = req.body;

    if(!recieverId) return res.status(404).json({success:false,message:"sender id not found."});

    const senderId = req.user._id;

    try {
        let message = {
            senderId,
            recieverId,
        }

        if(test) message.text=text;

        if(image)
        {
            // const supportedType = ["mp4", "mov", "jpg", "jpeg", "png"]
            // const fileType = file.originalname.split('.')[1]
            // if (!supportedType.includes(fileType)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "file type not supported."
            //     })
            // }

            // const postSize = file.size
            // const maxSize = 2097152
            // if (postSize > maxSize) {
            //     return res.status(413).json({
            //         success: false,
            //         message: "file size is too large."
            //     })
            // }
            const response = await createPostCloudinary(image, "profile pic - chat app")

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

        return res.status(200).json({success:true,message:"message saved successfully."});
    } catch (error) {
        console.log("Somthing went wrong while sending message.");

        return res.status(500).json({success:false,message:error.message});
    }
    // finally
    // {
    //     if(file) fs.unlinkSync(file.path);
    // }

}