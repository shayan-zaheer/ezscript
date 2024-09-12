import Avatar from '@mui/material/Avatar';
import { deepPurple, deepOrange } from '@mui/material/colors';

function Client({ username, role, isCurrentUser, onGrantPermission, onRevokePermission }) {
    return (
        <div className="flex items-center flex-col font-bold">
            <Avatar variant="square" sx={role === "editor" ? {bgcolor: deepPurple[500]} : {bgcolor: deepOrange[500]}}>{username[0]}{`(${role[0].toUpperCase()})`}</Avatar>
            <span className="text-white font-bold">{`${username}`}</span>

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
