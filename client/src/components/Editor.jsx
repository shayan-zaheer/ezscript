import { useEffect, useRef, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { DNA } from "react-loader-spinner";
import ACTIONS from "../actions";
import LANGUAGES from "../../languages";

function Editor({
    socketRef,
    roomId,
    userRole,
    output,
    setEditInstance,
    language,
    setLanguage,
}) {
    const handleLangChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        if (socketRef.current) {
            socketRef.current.emit("language-change", {
                roomId,
                language: newLanguage,
            });
        }
    };

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
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                        main
                        {
                            LANGUAGES.find((lang) => lang.value == language)
                                .extension
                        }
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={language}
                        disabled={userRole == "viewer"}
                        onChange={handleLangChange}
                        className="w-full p-2 rounded-xl bg-slate-800/50 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    >
                        {LANGUAGES.map((lang) => (
                            <option
                                key={lang.name}
                                value={lang.value}
                                className="bg-slate-800"
                            >
                                🔓 {lang.name}
                            </option>
                        ))}
                    </select>
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                            userRole === "editor"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                        }`}
                    >
                        {userRole === "editor" ? "🔓 Editor" : "👁️ Viewer"}
                    </span>
                </div>
            </div>

            <div className="flex-1 relative">
                <MonacoEditor
                    className="custom"
                    height="100%"
                    language={
                        LANGUAGES.find((lang) => lang.value == language).value
                    }
                    theme="vs-dark"
                    onMount={(editor) => {
                        editorRef.current = editor;
                        setEditInstance(editor);

                        if (socketRef.current && !hasRequestedSync.current) {
                            socketRef.current.emit("request-code-sync", {
                                roomId,
                            });
                            hasRequestedSync.current = true;
                        }
                    }}
                    options={{
                        readOnly: userRole === "viewer",
                        fontSize: 16,
                        fontFamily:
                            "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
                        lineHeight: 1.6,
                        padding: { top: 20, bottom: 20 },
                        scrollBeyondLastLine: false,
                        minimap: { enabled: true },
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true,
                        },
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        renderLineHighlight: "all",
                        wordWrap: "on",
                    }}
                    onChange={handleCodeChange}
                    loading={
                        <div className="flex items-center justify-center h-full bg-slate-900">
                            <div className="text-center">
                                <DNA
                                    visible={true}
                                    height="100%"
                                    width="100%"
                                    ariaLabel="dna-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="dna-wrapper"
                                />
                                <p className="text-gray-400 mt-4 loading-dots">
                                    Loading editor
                                </p>
                            </div>
                        </div>
                    }
                />
            </div>

            <div className="h-48 border-t border-white/10">
                <div className="flex items-center gap-2 p-3 bg-slate-800 border-b border-white/10">
                    <span className="text-sm font-medium text-gray-300">
                        📟 Output
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="h-full bg-slate-900 p-4 overflow-auto">
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {output || "// Run your code to see output here..."}
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default Editor;
