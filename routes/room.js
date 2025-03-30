const express = require("express")
const router = express.Router()

const { getRoomDetails, createRoom, joinRoom, deleteSingleRoom, getSingleRoom, getParticipants } = require("../controllers/room")

router.route("/").post(createRoom).patch(joinRoom).get(getRoomDetails)
router.route("/participants").get(getParticipants)
router.route("/:id").delete(deleteSingleRoom).get(getSingleRoom)

module.exports = router