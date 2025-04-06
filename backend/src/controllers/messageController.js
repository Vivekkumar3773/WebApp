const Users = require("../models/user.model");
const Messages = require("../models/message.model");

const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

exports.getUsersForSidebar = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = await Users.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filterUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getMessages = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Messages.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error In GetMessages Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.postSendMessage = async (req, res) => {
    try {
        const { text, images } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        // ✅ Validate image input
        if (images) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(images, {
                    folder: "chat-app", // optional: to organize images
                });
                imageUrl = uploadResponse.secure_url;
                console.log("Image uploaded:", imageUrl);
            } catch (cloudErr) {
                console.error("Cloudinary Upload Error:", cloudErr.message);
                return res.status(400).json({ error: "Image upload failed." });
            }
        }

        // ✅ Create and save the new message
        const newMessage = new Messages({
            senderId,
            receiverId,
            text,
            image: imageUrl || null,
        });

        await newMessage.save();

        // ✅ Emit to receiver if online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
