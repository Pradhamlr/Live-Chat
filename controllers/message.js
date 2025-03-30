const Message = require("../models/message")
const { StatusCodes } = require("http-status-codes")

const sendMessage = async (req, res) => {
    req.body.sender = req.user.userId
    const message = await Message.create({ ...req.body })
    res.status(StatusCodes.OK).json({ message })
}

const getMessages = async (req, res) => {
    const {params: {id: roomID}} = req
    const messages = await Message.find({ roomId: roomID})
    res.status(StatusCodes.OK).json({ messages })
}

module.exports = { sendMessage, getMessages }