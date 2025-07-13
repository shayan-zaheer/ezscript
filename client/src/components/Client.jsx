import Avatar from '@mui/material/Avatar';
import { deepPurple, deepOrange } from '@mui/material/colors';

function Client({ username, role, isCurrentUser, onGrantPermission, onRevokePermission, currentUserRole }) {
    const isEditor = role === "editor";
    
    return (
        <div className="flex items-center justify-between w-full p-3 glass-dark rounded-xl hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="user-avatar relative">
                    <Avatar 
                        variant="rounded" 
                        sx={{
                            bgcolor: isEditor ? deepPurple[500] : deepOrange[500],
                            width: 40,
                            height: 40,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: isEditor 
                                ? '0 0 20px rgba(139, 92, 246, 0.4)' 
                                : '0 0 20px rgba(249, 115, 22, 0.4)'
                        }}
                    >
                        {username[0].toUpperCase()}
                    </Avatar>

                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold ${
                        isEditor ? 'bg-purple-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                        {role[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 pulse-green"></div>
                </div>
                
                <div>
                    <div className="font-semibold text-white text-sm">
                        {username}
                        {isCurrentUser && (
                            <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                You
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400 capitalize flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isEditor ? 'bg-purple-400' : 'bg-orange-400'}`}></span>
                        {role}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {!isCurrentUser && currentUserRole === "editor" && role === "viewer" && (
                    <button 
                        className="btn grantBtn text-xs px-3 py-1.5"
                        onClick={onGrantPermission}
                    >
                        <span className="mr-1">⬆️</span>
                        Grant
                    </button>
                )}

                {!isCurrentUser && currentUserRole === "editor" && role === "editor" && (
                    <button 
                        className="btn revokeBtn text-xs px-3 py-1.5"
                        onClick={onRevokePermission}
                    >
                        <span className="mr-1">⬇️</span>
                        Revoke
                    </button>
                )}
            </div>
        </div>
    );
}

export default Client;