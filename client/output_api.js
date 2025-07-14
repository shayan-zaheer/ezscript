import axios from "axios";
// import { lang_versions } from "./snippet";
import LANGUAGES from "./languages";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (code, language) => {
    const response = await API.post("/execute", {
        language: language,
        version: LANGUAGES.find(lang => lang.value == language).version,
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