import { useRef } from "react";
import {Editor as Edit} from "@monaco-editor/react";
import {DNA} from "react-loader-spinner";

function Editor(){
    const editRef = useRef();

    function handleEditorDidMount(editor){
        editRef.current = editor;
    }

    function runCode(){
        const code = editRef.current.getValue().toString();
        const output = eval(code);
        console.log(output);
    }

    return (
<>
            <Edit
                className="custom"
                height="90vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={`function HelloWorld(){\n\tconsole.log("Hello")\n}`}
                onMount={handleEditorDidMount}
                loading={<DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                    />}
          />
          <button className="btn" onClick={runCode}>Run Code</button>
</>
    )
};

export default Editor;