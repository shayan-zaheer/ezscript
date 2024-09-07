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

function getAllConnectedClients(roomId) {
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketID) => {
			return {
				socketID,
				username: userSocketMap[socketID],
			};
		}
	);
}

io.on("connection", (socket) => {
	console.log(`Socket connected! ${socket.id}`);

	// Handle user joining the room
	socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
		userSocketMap[socket.id] = username;
		socket.join(roomId);

		// Get all clients in the room
		const clients = getAllConnectedClients(roomId);

		// Notify all clients about the new joiner
		clients.forEach(({ socketID }) => {
			io.to(socketID).emit("joined", {
				clients,
				username,
				recentJoinedID: socket.id,
			});
		});

        console.log(clients);

		if (clients.length > 1) {
			// Request code from the first client (can be any other client in the room)
			io.to(clients[0].socketID).emit(ACTIONS.SYNC_CODE, {
				recentJoinedID: socket.id,
			});
		}
	});

	// Handle code changes and broadcast to others
	socket.on(ACTIONS.CODE_CHANGE, ({ roomId, value }) => {
		socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE, { value });
	});

	// When receiving a code sync request, send the current code to the new user
	socket.on(ACTIONS.SYNC_CODE, ({ recentJoinedID, value }) => {
		io.to(recentJoinedID).emit(ACTIONS.CODE_CHANGE, { value });
	});

	// Handle disconnection
	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
				socketID: socket.id,
				username: userSocketMap[socket.id],
			});
		});
		delete userSocketMap[socket.id];
	});
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}!`);
});
