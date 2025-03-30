const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide name"]
    },
    roomCode: {
        type: String,
        required: [true, "Please Provide Room Code"],
        default: () => uuidv4().slice(0, 6)
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide User Details"]
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model("Room", roomSchema)