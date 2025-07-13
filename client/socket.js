import {io} from "socket.io-client";

export const initSocket = async () => {
    const options = {
        "force new connection": true,
        reconnectionAttempts: 10,
        timeout: 10000,
        transports: ['websocket'],
        autoConnect: true
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    console.log("Connecting to:", backendUrl);  

    return io(backendUrl, options);
}