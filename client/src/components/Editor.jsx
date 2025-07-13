import Textarea from "@mui/joy/Textarea";
import { useEffect, useRef } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";
import ACTIONS from "../actions";

function Editor({ socketRef, roomId, userRole, output, setEditInstance }) {
    const editorRef = useRef(null);
    const isUpdatingFromServer = useRef(false);
    const hasRequestedSync = useRef(false);

    useEffect(() => {
        const init = () => {
            if (socketRef.current) {
                socketRef.current.on(ACTIONS.CODE_CHANGE, ({ value }) => {
                    if (
                        editorRef.current &&
                        value !== editorRef.current?.getValue()
                    ) {
                        isUpdatingFromServer.current = true;
                        editorRef.current?.setValue(value);
                        setEditInstance(editorRef.current);
                    }
                });
            }
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.updateOptions({
                readOnly: userRole === "viewer",
            });
        }
    }, [userRole]);

    function handleCodeChange(value) {
        if (!isUpdatingFromServer.current) {
            if (socketRef.current) {
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    value,
                });
            }
        }
        isUpdatingFromServer.current = false;
    }

    return (
        <>
            <MonacoEditor
                className="custom"
                height="68vh"
                language="javascript"
                theme="vs-dark"
                onMount={(editor) => {
                    editorRef.current = editor;
                    setEditInstance(editor);

                    if (socketRef.current && !hasRequestedSync.current) {
                        socketRef.current.emit("request-code-sync", { roomId });
                        hasRequestedSync.current = true;
                    }
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
            <Textarea
                style={{ backgroundColor: "#1E1E1E" }}
                className="mt-[10px]"
                placeholder="See output here!"
                disabled
                minRows={8}
                variant="soft"
                value={output}
            />
        </>
    );
}

export default Editor;
