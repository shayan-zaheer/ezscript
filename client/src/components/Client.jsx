import Avatar from "react-avatar";
import React from "react";

function Client({ username, role, isCurrentUser, onGrantPermission, onRevokePermission }) {
    return (
        <div className="client">
            <Avatar name={username} size={50} round="14px" />
            <span className="username">{username} {isCurrentUser && "(You)"}</span>
            <span className={`roleTag ${role}`}>{role}</span>

            {!isCurrentUser && role === "viewer" && (
                <button className="btn grantBtn" onClick={onGrantPermission}>
                    Grant Edit
                </button>
            )}

            {!isCurrentUser && role === "editor" && (
                <button className="btn revokeBtn" onClick={onRevokePermission}>
                    Revoke Edit
                </button>
            )}
        </div>
    );
}

export default Client;
