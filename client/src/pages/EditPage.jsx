import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../../socket";
// import ACTIONS from "../../../server/actions";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function EditPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const socketRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on("connect_error", err => handleErrors(err));
            socketRef.current.on("connect_failed", err => handleErrors(err));

            function handleErrors(error){
                console.log("Socket error!", error);
                toast.error("Socket connection failed, try again later!", {
                    theme: "dark",
                    position: "top-right"
                });
                navigate("/");
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username
            })
        };

        init();

    }, []);

	const [clients, setClients] = useState([
		{
			socketId: 1,
			username: "Rakesh K",
		},
		{
			socketId: 2,
			username: "John Doe",
		},
        {
			socketId: 3,
			username: "King Kong",
		},
	]);

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
								key={client.socketId}
							/>
						))}
					</div>
				</div>
                <button className="btn copy">Copy Room ID</button>
                <button className="btn leave">Leave</button>
			</div>
			<div className="edit-wrap">
                <Editor />
            </div>
		</div>
	);
}

export default EditPage;
