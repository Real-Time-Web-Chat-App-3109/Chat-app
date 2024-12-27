import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        fullName:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
            minlength: 8
        },
        profilePic:{
            type: String,
            default: "",
        },
    },
    { timestamp: true }
);

export const User = mongoose.model("User", userSchema);

