import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
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
                const { run: result } = await executeCode(code);
                console.log(result);
                setOutput(result.output);
            } catch (err) {
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

			socketRef.current.on(
				"joined",
				({ username, clients, recentJoinedID, role }) => {
					if (username !== location.state?.username) {
						toast.success(`${username} joined the room!`, {
							theme: "dark",
							position: "top-right",
						});
					}
					setClients(clients);
                    if(editInstance){
                            console.log(editInstance?.getValue())
                            socketRef.current.emit("sync-code", {
                                recentJoinedID,
                                value: editInstance?.getValue() || "",
                            });
                        }
				}
			);

			socketRef.current.on("disconnected", ({ socketID, username }) => {
				toast.success(`${username} left the room!`, {
					theme: "dark",
					position: "top-right",
				});
				setClients((prev) =>
					prev.filter((client) => client.socketID !== socketID)
				);
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
		<div className="grid grid-cols-[230px,1fr] h-screen">
			<div className="bg-[#1a2025] p-[16px] text-white flex flex-col">
                    <div className="flex gap-2">
                        <div className="bg-purple-800 w-4 h-4 mb-3"></div>Editor
                        <div className="bg-orange-800 w-4 h-4 mb-3"></div>Viewer
                    </div>
				<div className="flex-1">
					<ToastContainer />
					<div className="flex items-center flex-wrap gap-[20px]">
						{clients.map((client) => (
							<Client
								username={client.username}
								key={client.socketID}
								role={client.role}
                                // role={userRole}
								isCurrentUser={
									client.socketID === socketRef.current.id
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
				</div>
				<label className="border-none p-[10px] rounded-[5px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out bg-[#4aed88] mb-[20px] text-black text-center hover:bg-[#2b824c]">
					Open File
					<input
						className="hidden"
						onChange={handleOpenFile}
						accept=".js,.jsx"
						type="file"
					/>
				</label>
				<button
					onClick={copyRoomId}
					className="border-none p-[10px] rounded-[5px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out text-black bg-[#e3e2e2] hover:bg-[#dfd8d8b8]"
				>
					Copy Room ID
				</button>
				<button
					onClick={runCode}
					className="border-none p-[10px] rounded-[5px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out mt-[20px] w-full text-black bg-[#e3e2e2] hover:bg-[#dfd8d8b8]"
				>
					Run Code
				</button>
				<button
					onClick={leaveRoom}
					className="border-none p-[10px] rounded-[5px] text-[16px] cursor-pointer transition-all duration-300 bg-[#4aed88] ease-in-out mt-[20px] w-full text-black hover:bg-[#2b824c]"
				>
					Leave
				</button>
			</div>
            <div className="edit-wrap">
			<Editor
                output={output}
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
