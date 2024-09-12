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
        <div className="flex justify-center items-center text-[#f5f5f5] h-screen">
            <div className="bg-[#0C1419] drop-shadow-lg p-[20px] rounded-[10px] w-[400px] max-w-[90%]">
                <div className="flex flex-col">
                    <img src="./EZScript.png" className="mb-[5px]"/>
                    <input
                        onKeyUp={handleEnter}
                        type="text"
                        ref={inputRef}
                        className="p-[10px] rounded-[5px] outline-none border-none mb-[15px] text-[#212121] bg-[#eee] text-[16px] font-bold"
                        placeholder="ROOM ID"
                    />
                    <input
                        onKeyUp={handleEnter}
                        type="text"
                        ref={userRef}
                        className="p-[10px] rounded-[5px] outline-none border-none mb-[15px] text-[#212121] bg-[#eee] text-[16px] font-bold"
                        placeholder="USERNAME"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-[10px] rounded-[5px] outline-none border-none mb-[15px] text-[#212121] bg-[#eee] text-[16px] font-bold"
                    >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <button onClick={joinRoom} className="border-none p-[10px] rounded-[5px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out bg-[#4aed88] w-full ml-auto text-black hover:bg-[#2b824c]">
                        Join
                    </button>
                    <span className="mt-[20px] w-full">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="text-[#4aed88] no-underline border-b-[1px] border-b-solid border-b-[#4aed88] transition-all duration-300ms ease-in-out hover:border-b-[#2b824c] hover:text-[#2b824c]"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default HomePage;
