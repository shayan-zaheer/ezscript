import { useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";

function EditPage() {
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
