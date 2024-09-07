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
        <div className="home-wrap">
            <div className="form-wrap">
                <h5 className="label">Paste invitation</h5>
                <div className="inputs">
                    <input
                        onKeyUp={handleEnter}
                        type="text"
                        ref={inputRef}
                        className="input-box"
                        placeholder="ROOM ID"
                    />
                    <input
                        onKeyUp={handleEnter}
                        type="text"
                        ref={userRef}
                        className="input-box"
                        placeholder="USERNAME"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input-box"
                    >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <button onClick={joinRoom} className="btn join">
                        Join
                    </button>
                    <span className="room-create">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="create-new"
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
