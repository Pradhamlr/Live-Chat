const User = require("../models/user")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")
const crypto = require("crypto")
const { STATUS_CODES } = require("http")

function createAvatar(email, size = 200) {
    const emailHash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex")
    return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`
}

const register = async (req, res) => {
    const { mail } = req.body
    const gravatar = createAvatar(mail)
    req.body.avatar = gravatar
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: {name: user.name }, token})
}

const login = async (req, res) => {
    const {mail, password} = req.body
    if(!mail || !password) {
        throw new BadRequestError("Please Provide Email And Password")
    }

    const user = await User.findOne({ mail })
    if(!user) {
        throw new NotFoundError("Invalid Credentials")
    }

    const isPassword = user.comparePassword(password)
    if(!isPassword) {
        throw new BadRequestError("Invalid Password, Try Again")
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: {name: user.name, id: user._id}, token})
}

const getUserDetails = async (req, res) => {
    const { params: {id: userID} } = req
    const user = await User.findOne({ _id: userID })
    if(!user) {
        throw new NotFoundError("User Not Found")
    }
    res.status(StatusCodes.OK).json({ user })
}


module.exports = { login, register, getUserDetails }