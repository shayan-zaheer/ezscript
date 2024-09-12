import Textarea from '@mui/joy/Textarea';
import { useEffect, useRef } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";

function Editor({ socketRef, roomId, userRole, output, setEditInstance }) {
    // console.log(socketRef.current, userRole);

    const editorRef = useRef(null);
    const isUpdatingFromServer = useRef(false);

    // useEffect(() => {
    //     if(editorRef.current){
    //         setEditInstance(editorRef.current);
    //     }
    // }, [editorRef.current]);

    useEffect(() => {
        const init = () => {
            if (socketRef.current) {
                socketRef.current.on("code-change", ({ value }) => {
                    if (editorRef.current && value !== editorRef.current?.getValue()) {
                        isUpdatingFromServer.current = true;
                        editorRef.current?.setValue(value);
                        setEditInstance(editorRef.current);
                    }
                });

                socketRef.current.on("role-update", ({ socketId, role }) => {
                    if (socketId === socketRef.current.id) {
                        // setUserRole(role);
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
        <MonacoEditor
            className="custom"
            height="68vh"
            language="javascript"
            theme="vs-dark"
            onMount={(editor) => {
                editorRef.current = editor;
                setEditInstance(editor);
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
        <Textarea style={{backgroundColor: "#1E1E1E"}} className="mt-[10px]" placeholder="See output here!" disabled minRows={8} variant="soft" value={output} />
        </>
    );
}

export default Editor;
