import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
import ACTIONS from "../actions";
import {
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { executeCode } from "../../output_api";

function EditPage() {
    const [editInstance, setEditInstance] = useState("");
    const [language, setLanguage] = useState("javascript");
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
        if (editInstance) {
            try {
                const code = editInstance?.getValue();
                const { run: result } = await executeCode(code, language);
                setOutput(result.output);
            } catch (err) {
                console.error(err);
                setOutput(err.message);
            }
        } else {
            toast.error("Code instance not available!", {
                theme: "dark",
                position: "top-right",
            });
        }
    }

    function handleOpenFile(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                if (editInstance) {
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
            try {
                socketRef.current = await initSocket();

                socketRef.current.on("connect", () => {
                    console.log(
                        "Socket connected with ID:",
                        socketRef.current.id
                    );
                });

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

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                    role: location.state?.role,
                });
                socketRef.current.on(
                    ACTIONS.JOINED,
                    ({ username, clients, recentJoinedID, role }) => {
                        if (username !== location.state?.username) {
                            toast.success(`${username} joined the room!`, {
                                theme: "dark",
                                position: "top-right",
                            });
                        }
                        setClients(clients);
                    }
                );
                socketRef.current.on(
                    ACTIONS.DISCONNECTED,
                    ({ socketID, username }) => {
                        toast.success(`${username} left the room!`, {
                            theme: "dark",
                            position: "top-right",
                        });
                        setClients((prev) =>
                            prev.filter(
                                (client) => client.socketID !== socketID
                            )
                        );
                    }
                );

                socketRef.current.on("language-change", ({ language: newLanguage, changedBy }) => {
                    setLanguage(newLanguage);
                    toast.info(`Language changed to ${newLanguage}${changedBy ? ` by ${changedBy}` : ''}!`, {
                        theme: "dark",
                        position: "top-right",
                    });
                });

                socketRef.current.on("role-update", ({ socketId, role }) => {
                    if (socketId === socketRef.current.id) {
                        setUserRole(role);
                        toast.info(`Your role has been updated to ${role}!`, {
                            theme: "dark",
                            position: "top-right",
                        });
                    }

                    setClients((prev) =>
                        prev.map((client) =>
                            client.socketID === socketId
                                ? { ...client, role }
                                : client
                        )
                    );
                });
            } catch (error) {
                console.error("Failed to initialize socket:", error);
                toast.error("Failed to connect to server!", {
                    theme: "dark",
                    position: "top-right",
                });
                navigate("/");
            }
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOIN);
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off("role-update");
                socketRef.current.off("language-change");
                socketRef.current.off("connect_error");
                socketRef.current.off("connect_failed");
            }
        };
    }, [navigate, roomId, location.state]);

    if (!location.state) return <Navigate to="/" />;

    return (
        <>
            <Helmet>
                <title>EZScript Editor - Collaborative Coding Room</title>
                <meta name="description" content="Collaborate in real-time with others in a secure coding room. Edit, run, and share code with live role management and language support." />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="grid grid-cols-[280px,1fr] h-screen">
                    <aside className="sidebar p-6 text-white flex flex-col relative overflow-hidden" aria-label="Sidebar">
                        <div className="absolute inset-0 opacity-10" aria-hidden="true">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
                        </div>

                        <header className="relative z-10 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xl font-bold" aria-hidden="true">⚡</span>
                                </div>
                                <h1 className="text-2xl font-bold glow-text" id="main-title">EZScript</h1>
                            </div>

                            <section className="glass-dark rounded-xl p-4 mb-6" aria-labelledby="roles-heading">
                                <h2 className="text-sm font-semibold mb-3 text-gray-300" id="roles-heading">Roles</h2>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="role-indicator editor" aria-label="Editor role indicator"></div>
                                        <span className="text-sm font-medium">Editor</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="role-indicator viewer" aria-label="Viewer role indicator"></div>
                                        <span className="text-sm font-medium">Viewer</span>
                                    </div>
                                </div>
                            </section>
                        </header>

                        <main className="flex-1 relative z-10">
                            <section className="glass-dark rounded-xl p-4 mb-6" aria-labelledby="connected-users-heading">
                                <h2 className="text-sm font-semibold mb-4 text-gray-300 flex items-center gap-2" id="connected-users-heading">
                                    <span className="w-2 h-2 bg-green-500 rounded-full pulse-green" aria-hidden="true"></span>
                                    Connected Users
                                </h2>
                                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                                    {clients.map((client) => (
                                        <Client
                                            username={client.username}
                                            key={client.socketID}
                                            role={client.role}
                                            currentUserRole={userRole}
                                            isCurrentUser={
                                                client.socketID === socketRef.current?.id
                                            }
                                            onGrantPermission={() =>
                                                grantPermission(client.socketID)
                                            }
                                            onRevokePermission={() =>
                                                revokePermission(client.socketID)
                                            }
                                        />
                                    ))}
                                </div>
                            </section>
                        </main>

                        <nav className="space-y-4 relative z-10" aria-label="Sidebar actions">
                            <label className="file-input-wrapper block p-4 rounded-xl text-center cursor-pointer transition-all duration-300 font-medium text-white">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg" aria-hidden="true">📁</span>
                                    <span>Open File</span>
                                </div>
                                <input
                                    className="hidden"
                                    onChange={handleOpenFile}
                                    accept=".js,.jsx,.ts,.tsx,.py,.c,.cpp"
                                    type="file"
                                    aria-label="Open a code file"
                                />
                            </label>

                            <button
                                onClick={copyRoomId}
                                className="w-full p-4 rounded-xl font-medium transition-all duration-300 glass-dark hover:bg-white/20 text-white flex items-center justify-center gap-2"
                                aria-label="Copy Room ID"
                            >
                                <span className="text-lg" aria-hidden="true">📋</span>
                                Copy Room ID
                            </button>

                            <button
                                onClick={runCode}
                                className="w-full p-4 rounded-xl font-medium btn-primary flex items-center justify-center gap-2"
                                aria-label="Run Code"
                            >
                                <span className="text-lg" aria-hidden="true">▶️</span>
                                Run Code
                            </button>

                            <button
                                onClick={leaveRoom}
                                className="w-full p-4 rounded-xl font-medium btn-success flex items-center justify-center gap-2"
                                aria-label="Leave Room"
                            >
                                <span className="text-lg" aria-hidden="true">🚪</span>
                                Leave Room
                            </button>
                        </nav>
                    </aside>

                    <div className="relative p-6">
                        <div className="editor-wrapper h-full">
                            <Editor
                                output={output}
                                userRole={userRole}
                                setUserRole={setUserRole}
                                setEditInstance={setEditInstance}
                                socketRef={socketRef}
                                roomId={roomId}
                                language={language}
                                setLanguage={setLanguage}
                            />
                        </div>
                    </div>
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    toastStyle={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: 'white'
                    }}
                />
            </div>
        </>
    );
}

export default EditPage;
