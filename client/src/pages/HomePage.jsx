import { Link } from "react-router-dom";

function HomePage(){
    return (
        <div className="home-wrap">
            <div className="form-wrap">
                <h5 className="label">
                    Paste invitation
                </h5>
                <div className="inputs">
                    <input type="text" className="input-box" placeholder="ROOM ID" />
                    <input type="text" className="input-box" placeholder="USERNAME" />
                    <button className="btn join">Join</button>
                    <span className="room-create">
                        If you don't have an invite then create &nbsp;
                        <Link to="" className="create-new">
                            new room
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
};

export default HomePage;