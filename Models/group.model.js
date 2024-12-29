import mongoose, {Schema} from "mongoose";

const groupSchema = new Schema({
    groupName:{
        type:String,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
},{timestamps:true});

export const Group = mongoose.model("Group",groupSchema);