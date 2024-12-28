import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text:{
            type: String,
        },
        image:{
            type: String,
        },
        cloudinaryId:{
            type:String,
            default:undefined
        }
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

