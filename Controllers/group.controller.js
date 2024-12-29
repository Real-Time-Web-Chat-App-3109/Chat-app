import { Group } from "../Models/group.model.js";
import { Message } from "../Models/message.model.js";
import { getReceiverSocketId, io } from "../Utility/Socket.js";

async function createGroup(req, res) {
  let { groupName, members } = req.body;

  if (!groupName || !members) {
    return res
      .status(404)
      .json({ success: false, message: "all credentials are required" });
  }

  members = [...members, req.user._id];

  try {
    const newGroup = await Group.create({
      groupName,
      members,
    });

    if (!newGroup)
      return res
        .status(500)
        .json({
          success: true,
          message: "something went wrong while creating group.",
        });

    return res
      .status(200)
      .json({
        success: true,
        message: "new created successfully",
        data: newGroup,
      });
  } catch (error) {
    console.log("something went wrong while creating group");

    return res
      .status(500)
      .json({
        success: false,
        message: "something went wrong while creating group",
        error: error.message,
      });
  }
}

async function getGroups(req, res) {
  try {
    const groups = await Group.find({members:req?.user?._id});

    if (!groups)
      return res
        .status(500)
        .json({ success: false, message: "no group found" });

    return res
      .status(200)
      .json({
        success: true,
        message: "groups found  successfully.",
        data: groups,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "something went wrong while getting group",
        error: error.message,
      });
  }
}

async function sendGroupMessage(req, res) {
  const { text } = req.body;
  const groupId = req.params.id;

  const file = req.file;

  if (!groupId)
    return res
      .status(404)
      .json({ success: false, message: "receiverId not found." });

  const senderId = req.user._id;

  try {
    let message = {
      senderId,
      groupId,
    };

    if (text) message.text = text;

    if (file) {
      const supportedType = ["mp4", "mov", "jpg", "jpeg", "png"];
      const fileType = file.originalname.split(".")[1];
      if (!supportedType.includes(fileType)) {
        return res.status(400).json({
          success: false,
          message: "file type not supported.",
        });
      }

      const postSize = file.size;
      const maxSize = 2097152;
      if (postSize > maxSize) {
        return res.status(413).json({
          success: false,
          message: "file size is too large.",
        });
      }
      const response = await createPostCloudinary(
        file,
        "message image - chat app"
      );

      if (!response) {
        return res.status(500).json({
          success: false,
          message: "error while uploading Post.",
        });
      }

      message.image = response.secure_url;
      message.cloudinaryId = response.public_id;
    }

    const savedMessage = await Message.create(message);

    if (!savedMessage)
      return res
        .status(500)
        .json({
          success: false,
          message: "Somthing went wrong while saveing message.",
        });

    const group = await Group.findById(groupId);

    const members = group.members;

    members.forEach((receiverId)=>{

      if(receiverId.equals(senderId)) return;

      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newGroupMessage", savedMessage);
      }
    })

    

    

    return res
      .status(200)
      .json({
        success: true,
        message: "message saved successfully.",
        data: savedMessage,
      });
  } catch (error) {
    console.log("Somthing went wrong while sending message.");

    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (file) fs.unlinkSync(file.path);
  }
}

async function fetchGroupMessage(req, res) {
  const groupId = req.params.id;

  if (!groupId)
    return res
      .status(404)
      .json({ success: false, message: "group id not found." });

  try {
    const message = await Message.find({groupId});

    if (!message)
      return res
        .status(500)
        .json({ success: false, message: "no message found." });

    return res
      .status(200)
      .json({
        success: true,
        message: "messages found successfully.",
        data: message,
      });
  } catch (error) {
    console.log("something went wrong while fetching group message. " + error.message);
    return res
      .status(500)
      .json({ success: false, message: "something  went wrong." });
  }
}

export { createGroup, getGroups ,sendGroupMessage,fetchGroupMessage};
