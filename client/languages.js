import {
    SiJavascript,
    SiTypescript,
    SiDotnet,
    SiPython,
    SiC,
    SiCplusplus,
    SiOracle,
} from "react-icons/si";

const LANGUAGES = [
  { name: "C", value: "c", version: "10.2.0", extension: ".c", icon: SiC },
  { name: "C++", value: "cpp", version: "10.2.0", extension: ".cpp", icon: SiCplusplus },
  { name: "Java", value: "java", version: "21.0.1", extension: ".java", icon: SiOracle },
  { name: "Python", value: "python", version: "3.10.0", extension: ".py", icon: SiPython },
  { name: "JavaScript", value: "javascript", version: "15.10.0", extension: ".js", icon: SiJavascript },
  { name: "TypeScript", value: "typescript", version: "5.0.3", extension: ".ts", icon: SiTypescript },
  { name: "C#", value: "csharp", version: "7.0.100", extension: ".cs", icon: SiDotnet },
];

export default LANGUAGES;
