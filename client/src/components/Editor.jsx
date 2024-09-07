import { useEffect, useRef, useState } from "react";
import { Editor as Edit } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";

function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);
    const isUpdatingFromServer = useRef(false);
    const [language, setLanguage] = useState("javascript");

    useEffect(() => {
        const init = () => {
            if (socketRef.current) {
                socketRef.current.on("code-change", ({ value }) => {
                    const editor = editorRef.current;
                    if (editor && value !== editor.getValue()) {
                        isUpdatingFromServer.current = true; // Mark that this change is coming from the server
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
            }
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.off("code-change");
                socketRef.current.off("sync-code");
            }
        };
    }, [socketRef.current]);

    function handleCodeChange(value, event) {
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
        <Edit
            className="custom"
            height="100vh"
            language={language}
            theme="vs-dark"
            onMount={(editor) => {
                editorRef.current = editor;
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
    );
}

export default Editor;