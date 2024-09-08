import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { executeCode } from "../../output_api";

function EditPage() {
    const [editInstance, setEditInstance] = useState(null);
    const location = useLocation();
    const [clients, setClients] = useState([]);
    const [output, setOutput] = useState("");
    const [userRole, setUserRole] = useState(location.state?.role || "viewer");

    const { roomId } = useParams();
    const navigate = useNavigate();
    const socketRef = useRef(null);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied to your clipboard!", {
                theme: "dark",
                position: "top-right",
            });
        } catch (err) {
            toast.error("Failed to copy Room ID!", {
                theme: "dark",
                position: "top-right",
            });
        }
    }

    async function runCode() {
        if (editInstance){
            try {
                const code = editInstance?.getValue();
                const { run: result } = await executeCode(code);
                setOutput(result.output);
                console.log(output);
            } catch (err) {
                setOutput(err);
            }
        }
    }

    function handleOpenFile(e){
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();

            reader.onload = e => {
                const content = e.target.result;
                if(editInstance){
                    editInstance?.setValue(content);
                }
            };
            reader.readAsText(file);
        }
    }

    function grantPermission(socketId) {
        if (socketRef.current) {
            socketRef.current.emit("grant-perm", { socketId, roomId });
        }
    }

    function revokePermission(socketId) {
        if (socketRef.current) {
            socketRef.current.emit("revoke-perm", { socketId, roomId });
        }
    }

    function leaveRoom() {
        navigate("/");
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on("connect_error", handleErrors);
            socketRef.current.on("connect_failed", handleErrors);

            function handleErrors(error) {
                console.log("Socket error!", error);
                toast.error("Socket connection failed, try again later!", {
                    theme: "dark",
                    position: "top-right",
                });
                navigate("/");
            }

            socketRef.current.emit("join", {
                roomId,
                username: location.state?.username,
                role: location.state?.role,
            });

            socketRef.current.on("joined", ({ username, clients, recentJoinedID, role }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room!`, {
                        theme: "dark",
                        position: "top-right",
                    });
                }
                setClients(clients);
                if (editInstance) {
                    console.log(editInstance?.getValue());
                    socketRef.current.emit("sync-code", {
                        recentJoinedID,
                        value: editInstance?.getValue() || "",
                    });
                }
            });

            socketRef.current.on("disconnected", ({ socketID, username }) => {
                toast.success(`${username} left the room!`, {
                    theme: "dark",
                    position: "top-right",
                });
                setClients((prev) => prev.filter((client) => client.socketID !== socketID));
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off("join");
                socketRef.current.off("joined");
                socketRef.current.off("disconnected");
                socketRef.current.off("connect_error");
                socketRef.current.off("connect_failed");
            }
        };
    }, [navigate, roomId, location.state]);

    if (!location.state) return <Navigate to="/" />;

    return (
        <div className="main-wrap">
            <div className="nav-bar">
                <div className="in-nav">
                    <ToastContainer />
                    <h3>Connected</h3>
                    <div className="connect-list">
                        {clients.map((client) => (
                            <Client
                                username={client.username}
                                key={client.socketID}
                                role={client.role}
                                // role={userRole}
                                isCurrentUser={client.socketID === socketRef.current.id}
                                onGrantPermission={() => grantPermission(client.socketID)}
                                onRevokePermission={() => revokePermission(client.socketID)}
                            />
                        ))}
                    </div>
                </div>
                <label className="btn open">Open File<input onChange={handleOpenFile} accept=".js,.jsx" type="file" /></label>
                <button onClick={copyRoomId} className="btn copy">Copy Room ID</button>
                <button onClick={runCode} className="btn run">Run Code</button>
                <button onClick={leaveRoom} className="btn leave">Leave</button>
            </div>
            <div className="edit-wrap">
                <Editor
                    userRole={userRole}
                    setUserRole={setUserRole}
                    setEditInstance={setEditInstance}
                    socketRef={socketRef}
                    roomId={roomId}
                />
            </div>
        </div>
    );
}

export default EditPage;
