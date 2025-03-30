const express = require("express")
const router = express.Router()

const { sendMessage, getMessages } = require("../controllers/message")

router.route("/").post(sendMessage)
router.route("/:id").get(getMessages)

module.exports = router