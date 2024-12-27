import { User } from "../Models/user.model.js";
import { Message } from "../Models/message.model.js";

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
