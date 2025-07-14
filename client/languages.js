const LANGUAGES = [
  { name: "C", value: "c", version: "10.2.0", extension: ".c" },
  { name: "C++", value: "cpp", version: "10.2.0", extension: ".cpp" },
  { name: "Java", value: "java", version: "21.0.1", extension: ".java" },
  { name: "Python", value: "python", version: "3.10.0", extension: ".py" },
  { name: "JavaScript", value: "javascript", version: "20.3.1", extension: ".js" },
  { name: "TypeScript", value: "typescript", version: "5.0.3", extension: ".ts" },
  { name: "C#", value: "csharp", version: "7.0.100", extension: ".cs" },
];

export default LANGUAGES;
// const response = await API.post("/execute", {
//     language: lang,
//     version: lang_versions[lang],
//     files: [
//         {
//             content: code
//         }
//     ]
// });