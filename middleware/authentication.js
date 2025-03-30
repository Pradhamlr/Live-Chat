const { UnauthenticatedError } = require("../errors")
const jwt = require("jsonwebtoken")

const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Invalid Token")
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userId, userName: decoded.userName}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Not Authorized To View")
    }
}

module.exports = authenticationMiddleware