const express = require("express")
const authMiddleware = require("../middleware/authentication")
const router = express.Router()

const { login, register, getUserDetails } = require("../controllers/user")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/:id").get(authMiddleware, getUserDetails)

module.exports = router