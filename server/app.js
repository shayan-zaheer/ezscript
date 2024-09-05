const express = require("express");
const http = require("http");
const app = express();
const {Server} = require("socket.io");
const ACTIONS = require("./actions");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketID => {
        return {
            socketID,
            username: userSocketMap[socketID]
        }
    }); // gives a map
}

io.on("connection", (socket) => {
    console.log(`Socket connected! ${socket.id}`)

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({socketID}) => {
            io.to(socketID).emit("joined", {
                clients, username, recentJoinedID: socket.id
            });
        })

        // ALTERNATE LOGICS, WILL CHECK LATER

        // socket.broadcast.to(roomId).emit("joined", {
        //     clients, username
        // })

        // io.to(roomId).emit("joined", {
        //     clients, username
        // })

        // socket.to(roomId).emit("joined", {
        //     clients, username
        // })
    })
})

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
});