const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Name"],
        minlength: 3
    },
    mail: {
        type: String,
        required: [true, "Please Provide Email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Provide Valid Email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please Provide Password"],
        minlength: 4
    },
    avatar: {
        type: String
    }
})

userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id, userName: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFE})
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", userSchema)

