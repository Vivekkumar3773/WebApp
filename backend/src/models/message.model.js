const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            require: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            require: true
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);