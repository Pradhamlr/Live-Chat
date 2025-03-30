const Room = require("../models/room")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

const createRoom = async (req, res) => {
    req.body.createdBy = req.user.userId
    req.body.participants = [req.user.userId]
    const room = await Room.create({ ...req.body })
    res.status(StatusCodes.OK).json({ room })
}

const joinRoom = async (req, res) => {
    const {roomCode} = req.body
    if(!roomCode) {
        throw new BadRequestError("Enter Valid Room Code")
    }
    
    const room = await Room.findOneAndUpdate({ roomCode },
         { $push: { participants: req.user.userId } }, { new: true, runValidators: true }
    )

    // participants: { $ne: req.user.userId } 

    if(!room) {
        throw new NotFoundError("Room Not Found")
    }
    res.status(StatusCodes.OK).json({ room })
}

const getRoomDetails = async (req, res) => {
    //  const {params: {id: roomID}} = req
    const room = await Room.find({ createdBy: req.user.userId })
    if(!room) {
        throw new NotFoundError("Room Not Found")
    }
    res.status(StatusCodes.OK).json({ count: room.length, room })
}

const deleteSingleRoom = async (req, res) => {
    const {params: {id: roomID}} = req
    const room = await Room.findOneAndDelete({ _id: roomID, createdBy: req.user.userId})
    if(!room) {
        throw new NotFoundError(`Room Not Found With ID: ${roomID}`)
    }
    res.status(StatusCodes.OK).json({ Msg: `${room.name} Deleted Successfully`})
}

const getSingleRoom = async (req, res) => {
    const {params: {id: roomID}} = req
    const room = await Room.findOne({ _id: roomID, createdBy: req.user.userId})
    if(!room) {
        throw new NotFoundError(`Room Not Found With ID: ${roomID}`)
    }
    res.status(StatusCodes.OK).json({ room })
}

const getParticipants = async (req, res) => {
     const { roomCode } = req.query
     const room = await Room.findOne({ roomCode }).populate("participants", "name avatar").exec()
     if(!room) {
        throw new NotFoundError("Room Not Found")
     }
    res.status(StatusCodes.OK).json( {participants: room.participants} )
    }

module.exports = { createRoom, joinRoom, getRoomDetails, deleteSingleRoom, getSingleRoom, getParticipants }