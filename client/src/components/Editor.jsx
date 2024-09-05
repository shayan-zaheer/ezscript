import { useEffect, useRef, useState } from "react";
import { Editor as Edit } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";
import { executeCode } from "../../output_api";

function Editor({socketID}) {
    const editRef = useRef();

    useEffect(() => {
        async function init(){

        }
    })

	const [output, setOutput] = useState("");
	const [language, setLanguage] = useState("javascript");

	// function handleEditorDidMount(editor, event) {
    //     console.log(event);
	// 	editRef.current = editor;
	// }

    function handleCodeChange(value, event){
        console.log("VALUE:", value);
        console.log("EVENT:", event);
        editRef.current = value;
    }

	async function runCode() {
		const code = editRef.current.getValue();
		if (!code) return;
		try {
			const { run: result } = await executeCode(code);
			setOutput(result);
		} catch (err) {
			setOutput(err);
		}
	}

	return (
		<Edit
			className="custom"
			height="100vh"
            onChange={handleCodeChange}
			// onMount={handleEditorDidMount}
			defaultLanguage={language}
			theme="vs-dark"
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
