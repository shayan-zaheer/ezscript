import { useEffect, useRef } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";

function Editor({ socketRef, roomId, onCodeChange, userRole }) {
    console.log(socketRef.current, userRole);

    const editorRef = useRef(null);
    const isUpdatingFromServer = useRef(false);

    function handleOpenFile(e){
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();

            reader.onload = e => {
                const content = e.target.result;
                if(editorRef.current){
                    editorRef.current.setValue(content);
                }
            };

            reader.readAsText(file);
        }
    }

    useEffect(() => {
        const init = () => {
            if (socketRef.current) {
                socketRef.current.on("code-change", ({ value }) => {
                    const editor = editorRef.current;
                    if (editor && value !== editor.getValue()) {
                        isUpdatingFromServer.current = true;
                        editor.setValue(value);
                        onCodeChange(value);
                    }
                });

                socketRef.current.on("sync-code", ({ recentJoinedID }) => {
                    const code = editorRef.current.getValue();
                    socketRef.current.emit("sync-code", {
                        recentJoinedID,
                        value: code,
                    });
                });

                socketRef.current.on("role-update", ({ socketId, role }) => {
                    if (socketId === socketRef.current.id) {
                        // socket role change then only changing
                        const editor = editorRef.current;
                        if (editor) {
                            editor.updateOptions({ readOnly: role === "viewer" });
                        }
                    }
                });
            }
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.off("code-change");
                socketRef.current.off("sync-code");
                socketRef.current.off("role-update");
            }
        };
    }, [socketRef.current]);

    function handleCodeChange(value) {
        if (!isUpdatingFromServer.current) {
            if (socketRef.current) {
                socketRef.current.emit("code-change", {
                    roomId,
                    value,
                });
            }
        }
        isUpdatingFromServer.current = false;
    }

    return (
        <>
        <input type="file" onChange={handleOpenFile} accept=".js,.jsx" />
        <MonacoEditor
            className="custom"
            height="100vh"
            language="javascript"
            theme="vs-dark"
            onMount={(editor) => {
                editorRef.current = editor;
            }}
            options={{
                readOnly: userRole === "viewer",
                fontSize: "20",
            }}
            onChange={handleCodeChange}
            loading={
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            }
        />
        </>
    );
}

export default Editor;
