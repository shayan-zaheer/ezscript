const express = require("express");
const http = require("http");
const app = express();
const {Server} = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`Socket connected! ${socket.id}`)
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
});