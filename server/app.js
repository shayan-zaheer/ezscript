const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const ACTIONS = require("./actions");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const userSocketMap = {};
const userRolesMap = {};
const roomCodeMap = {}; // Store current code for each room

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketID) => {
            return {
                socketID,
                username: userSocketMap[socketID],
                role: userRolesMap[socketID],
            };
        }
    );
}

io.on("connection", (socket) => {
    console.log(`Socket connected! ${socket.id}`);

    socket.on(ACTIONS.JOIN, ({ roomId, username, role }) => {
        userSocketMap[socket.id] = username;
        userRolesMap[socket.id] = role;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketID }) => {
            io.to(socketID).emit(ACTIONS.JOINED, {
                clients,
                username,
                role,
                recentJoinedID: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, value }) => {
        roomCodeMap[roomId] = value;
        socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE, { value });
    });

    socket.on("sync-code", ({ recentJoinedID, value }) => {
        io.to(recentJoinedID).emit(ACTIONS.CODE_CHANGE, { value });
    });

    socket.on("request-code-sync", ({ roomId }) => {
        if (roomCodeMap[roomId]) {
            socket.emit(ACTIONS.CODE_CHANGE, { value: roomCodeMap[roomId] });
        }
    });

    socket.on("grant-perm", ({ socketId, roomId }) => {
        if (userRolesMap[socket.id] === "editor") {
            userRolesMap[socketId] = "editor";

            io.to(roomId).emit("role-update", {
                socketId,
                role: "editor",
            });
        }
    });

    socket.on("revoke-perm", ({ socketId, roomId }) => {
        if (userRolesMap[socket.id] === "editor") {
            userRolesMap[socketId] = "viewer";

            io.to(roomId).emit("role-update", {
                socketId,
                role: "viewer",
            });
        }
    });

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketID: socket.id,
                username: userSocketMap[socket.id],
            });

            const remainingClients = getAllConnectedClients(roomId).filter(
                (client) => client.socketID !== socket.id
            );

            if (remainingClients.length === 0) {
                delete roomCodeMap[roomId];
            }
        });
        delete userSocketMap[socket.id];
        delete userRolesMap[socket.id];
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}!`);
});
