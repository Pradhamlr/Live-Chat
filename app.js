require("dotenv").config()
require("express-async-errors")
const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")

const express = require("express")
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
})

const connectDB = require("./db/connection")

const authRoutes = require("./routes/user")
const roomRoutes = require("./routes/room")
const messageRoutes = require("./routes/message")

const errorHandlerMiddleware = require("./middleware/error-handler")
const notFound = require("./middleware/not-found")
const authMiddleware = require("./middleware/authentication")

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
})

app.use("/api/v1/user", authRoutes)
app.use("/api/v1/room", authMiddleware, roomRoutes)
app.use("/api/v1/message", authMiddleware, messageRoutes)

const setupSocket = require("./websockets/message")
setupSocket(io)

app.use(errorHandlerMiddleware)
app.use(notFound)

const port = process.env.PORT || 3000

const start = async () => {
    await connectDB(process.env.MONGO_URI)
    server.listen(port, () => {
        console.log(`Listening On Port ${port}`)
    })
}

start()