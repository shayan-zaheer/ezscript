import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const userRef = useRef(null);

    const [role, setRole] = useState("viewer");

    function createNewRoom(event) {
        event.preventDefault();
        const id = uuid();
        inputRef.current.value = id;
        toast.success("Created a new room!", {
            theme: "dark",
            position: "top-right",
        });
    }

    function joinRoom(event) {
        event.preventDefault();
        const roomId = inputRef.current.value;
        const username = userRef.current.value;

        if (!roomId || !username) {
            return toast.error("Room ID and Username are required!", {
                theme: "dark",
                position: "top-right",
            });
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
                role,
            },
        });
    }

    function handleEnter(event) {
        if (event.code === "Enter") {
            joinRoom(event);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500 rounded-full blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="glass-dark p-8 rounded-2xl w-[450px] max-w-[90%] relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">⚡</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold glow-text">EZScript</h1>
                            <p className="text-sm text-gray-400">Collaborative Code Editor</p>
                        </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm">
                        Real-time collaborative coding experience
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <span>🏠</span>
                            Room ID
                        </label>
                        <input
                            onKeyUp={handleEnter}
                            type="text"
                            ref={inputRef}
                            className="w-full p-4 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter room ID or create new"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <span>👤</span>
                            Username
                        </label>
                        <input
                            onKeyUp={handleEnter}
                            type="text"
                            ref={userRef}
                            className="w-full p-4 rounded-xl bg-slate-800/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <span>🎭</span>
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-800/50 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        >
                            <option value="editor" className="bg-slate-800">🔓 Editor - Can write code</option>
                            <option value="viewer" className="bg-slate-800">👁️ Viewer - Read only</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={joinRoom} 
                            className="w-full p-4 rounded-xl font-medium btn-primary flex items-center justify-center gap-2 text-lg"
                        >
                            <span>🚀</span>
                            Join Room
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-400">Don't have a room? </span>
                            <button
                                onClick={createNewRoom}
                                className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors duration-300"
                            >
                                Create New Room
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Real-time sync
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Role management
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Code execution
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            File uploads
                        </div>
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
    );
}

export default HomePage;
