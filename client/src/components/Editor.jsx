import { useEffect } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';

function Editor(){

    useEffect(() => {
        async function init(){
            // Codemirror.fromTextArea(document.getElementById("realtime"), {
            //     mode: {
            //         name: "javascript",
            //         json: true
            //     },
            //     theme: "dracula",
            //     autoCloseTag: true,
            //     autoCloseBrackets: true,
            //     lineNumbers: true
            // });

        };

        init();
    }, []);

    return (
        <CodeMirror theme={dracula} height="200px" extensions={[javascript({ jsx: true })]} />
    )
};

export default Editor;