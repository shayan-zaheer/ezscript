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

// io.on("connection", (socket) => {
//     console.log(`Socket connected! ${socket.id}`)

//     socket.on(ACTIONS.JOIN, ({roomId, username}) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         console.log(clients);
//         clients.forEach(({socketID}) => {
//             io.to(socketID).emit("joined", {
//                 clients, username, recentJoinedID: socket.id
//             });
//         })

//         socket.on("code-change", ({roomId, value}) => {
//             socket.in(roomId).emit("code-change", {value});
//         })

//         socket.on("disconnecting", () => {
//             const rooms = [...socket.rooms];
//             rooms.forEach(roomId => {
//                 socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                     socketID: socket.id,
//                     username: userSocketMap[socket.id]
//                 });
//             });
//             delete userSocketMap[socket.id];
//             socket.leave();
//         });

io.on("connection", (socket) => {
    console.log(`Socket connected! ${socket.id}`);

    // Event for joining a room
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        
        // Fetch all connected clients in the room
        const clients = getAllConnectedClients(roomId);
        console.log(clients);

        // Notify all clients in the room, including the recent joiner
        clients.forEach(({ socketID }) => {
            io.to(socketID).emit("joined", {
                clients,
                username,
                recentJoinedID: socket.id
            });
        });
    });

    // Event for code changes
    socket.on("code-change", ({ roomId, value }) => {
        // Broadcast the code-change to all clients in the room, including the sender
        socket.broadcast.to(roomId).emit("code-change", { value });
    });

    // Handle disconnection
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms]; // Get the rooms the socket is in
        rooms.forEach(roomId => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketID: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        
        delete userSocketMap[socket.id]; // Clean up the user map
    });


        // ALTERNATE LOGICS FOR JOINING, WILL CHECK LATER

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

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
});