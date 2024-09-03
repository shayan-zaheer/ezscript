import axios from "axios";
import { lang_versions } from "./snippet";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (code) => {
    const response = await API.post("/execute", {
        language: "javascript",
        version: "18.15.0",
        files: [
            {
                content: code
            }
        ]
    });
    return response.data;
}
// const response = await API.post("/execute", {
//     language: lang,
//     version: lang_versions[lang],
//     files: [
//         {
//             content: code
//         }
//     ]
// });