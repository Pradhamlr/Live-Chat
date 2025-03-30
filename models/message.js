const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Text Field Cannot Be Empty"]
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide SenderID"]
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Please Provide RoomID"]
    }
}, {timestamps: true})

module.exports = mongoose.model("Message", messageSchema)