const axios = require("axios")
const Room = require("../models/room")

async function analyzeEmotion(message) {
    try {
        const response = await axios.post('https://flask-emotion-api-f99j.onrender.com/analyze', { message });
        return response.data;
    } catch (error) {
        console.error('Error analyzing emotion:', error);
        return { emotion: "Unknown", emoji: "❓" };
    }
}

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id)

        socket.on("joinRoom", (roomCode) => {
            socket.join(roomCode)
            console.log(`User ${socket.id} Joined Room ${roomCode}`)
        });

        socket.on("sendMessage", async (data) => {
            const emotionResult = await analyzeEmotion(data.message)
            const { roomCode, message, sender, userId } = data

            const messageData = {
                message,
                sender,
                userId,
                emoji: emotionResult.emoji
            }
            io.to(roomCode).emit("receiveMessage", messageData);
            console.log(`Message sent to ${roomCode}: ${message}`);
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} Disconnected`)
        });   
    });
};
