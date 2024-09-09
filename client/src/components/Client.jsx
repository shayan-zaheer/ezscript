import Avatar from "react-avatar";
import React from "react";

function Client({ username, role, isCurrentUser, onGrantPermission, onRevokePermission }) {
    return (
        <div className="flex items-center flex-col font-bold">
            <Avatar name={username} size={50} round="14px" />
            <span className="ml-[15px] text-white font-bold">{`${username} (${role})`}</span>

            {!isCurrentUser && role === "viewer" && (
                <button className="btn grantBtn" onClick={onGrantPermission}>
                    Grant Edit
                </button>
            )}

            {/* {!isCurrentUser && role === "editor" && (
                <button className="btn revokeBtn" onClick={onRevokePermission}>
                    Revoke Edit
                </button>
            )} */}
        </div>
    );
}

export default Client;
