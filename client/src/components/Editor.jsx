import { useEffect, useRef, useState } from "react";
import { Editor as Edit } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";
import { executeCode } from "../../output_api";

function Editor({ socketRef, roomId }) {
	const editorRef = useRef(null);
	const [output, setOutput] = useState("");
	const [language, setLanguage] = useState("javascript");

	useEffect(() => {
		const init = () => {
			if (socketRef.current) {
				socketRef.current.on("code-change", ({ value }) => {
					const editor = editorRef.current;
                    console.log(value);
					if (editor && value != null) {
						editor.setValue(value);
					}
				});
			}
		};
		init();


		return () => {
			if (socketRef.current) {
				socketRef.current.off("code-change");
			}
		};
	}, [editorRef.current]);

    function getEditorRef(){
        return editorRef;
    }

	async function runCode() {
		const editor = editorRef.current;
		const code = editor?.getValue();
		if (!code) return;
		try {
			const { run: result } = await executeCode(code);
			setOutput(result);
		} catch (err) {
			setOutput(err);
		}
	}

	function handleCodeChange(value, event) {
		if (socketRef.current) {
			socketRef.current.emit("code-change", {
				roomId,
				value,
			});
		}
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
