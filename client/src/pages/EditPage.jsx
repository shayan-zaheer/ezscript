import { useState } from "react";
import Client from "../components/Client";

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
                <button>Copy Room ID</button>
                <button>Leave</button>
			</div>
			<div className="edit-wrap">Editor goes here!</div>
		</div>
	);
}

export default EditPage;
