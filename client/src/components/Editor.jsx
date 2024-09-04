import { useRef, useState } from "react";
import { Editor as Edit } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";
import { executeCode } from "../../output_api";

function Editor() {
	const [output, setOutput] = useState("");
	const [language, setLanguage] = useState("javascript");
	const editRef = useRef();

	function handleEditorDidMount(editor) {
		editRef.current = editor;
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
		<>
			<Edit
				className="custom"
				height="90vh"
				defaultLanguage={language}
				theme="vs-dark"
				onMount={handleEditorDidMount}
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
			<button className="btn" onClick={runCode}>
				Run Code
			</button>
		</>
	);
}

export default Editor;
