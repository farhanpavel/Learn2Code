"use client";
import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import Review from "./Review";
import { FaPlay } from "react-icons/fa";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CodeEditorProps {}

const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  csharp: "6.12.0",
  php: "8.2.3",
  java: "15.0.2",
  typescript: "5.0.3",
  javascript: "18.15.0",
};

const CodeEditor: React.FC<CodeEditorProps> = () => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] =
    useState<keyof typeof LANGUAGE_VERSIONS>("javascript");
  const [activeTab, setActiveTab] = useState<"Editor" | "Output" | "Review">(
    "Editor"
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [review, setReview] = useState<string>("");
  const [lastSubmission, setLastSubmission] = useState<string>("");

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: keyof typeof CODE_SNIPPETS) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const executeCode = async (
    language: keyof typeof LANGUAGE_VERSIONS,
    sourceCode: string
  ) => {
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          version: LANGUAGE_VERSIONS[language],
          files: [
            {
              content: sourceCode,
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error executing code:", error);
      throw error;
    }
  };

  const generateReview = async (code: string) => {
    try {
      setReviewLoading(true);
      const response = await fetch(`${url}/api/code-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setReviewLoading(false);
      return data.result;
    } catch (error) {
      console.error("Error generating review:", error);
      throw error;
    }
  };

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
      setActiveTab("Output");
    } catch (error: any) {
      console.error(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
    } finally {
      setLoading(false);
    }
  };

  const getCode = (): string => {
    const sourceCode = editorRef.current?.getValue();
    return sourceCode || "no code";
  };

  const handleGetReview = async () => {
    const code = getCode();
    setLastSubmission(code);
    console.log("Fetched Code:", code);
    const reviewText = await generateReview(code);
    console.log("Review Text:", reviewText);
    setReview(reviewText);
    setActiveTab("Review");
  };

  useEffect(() => {
    const resizer = document.querySelector(".cursor-ew-resize");
    if (!resizer) return;

    const leftPanel = resizer.previousElementSibling as HTMLElement;
    const rightPanel = resizer.nextElementSibling as HTMLElement;

    const handleMouseDown = (event: MouseEvent) => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const newWidth = event.clientX - leftPanel.getBoundingClientRect().left;
      leftPanel.style.width = `${newWidth}px`;
      rightPanel.style.width = `calc(100% - ${newWidth}px - 0.25rem)`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    resizer.addEventListener("mousedown", handleMouseDown as EventListener);

    return () => {
      resizer.removeEventListener(
        "mousedown",
        handleMouseDown as EventListener
      );
    };
  }, []);

  return (
    <div className="flex flex-col bg-white h-auto">
      <div className="flex justify-between items-center py-2 px-6 bg-gray-100">
        <LanguageSelector language={language} onSelect={onSelect} />
        <div className="flex space-x-2 items-center">
          <div>
            <div className="flex -space-x-px">
              <Button
                className={`rounded-r-none focus:z-10 hover:bg-green-300 ${
                  activeTab === "Editor"
                    ? "bg-green-800 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveTab("Editor")}
              >
                Editor
              </Button>
              <Button
                className={`rounded-none focus:z-10 hover:bg-green-300 ${
                  activeTab === "Output"
                    ? "bg-green-800 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setActiveTab("Output")}
              >
                Output
              </Button>
              <Button
                className={`rounded-l-none focus:z-10 hover:bg-green-300 ${
                  activeTab === "Review"
                    ? "bg-green-800 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  if (getCode() !== lastSubmission) handleGetReview();
                  else setActiveTab("Review");
                }}
                disabled={reviewLoading}
              >
                {reviewLoading ? (
                  <Spinner size="sm" className="bg-black" />
                ) : (
                  "Review"
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-2 bg-green-800 p-1 rounded w-12 text-white text-sm"
          >
            {loading ? (
              <Spinner size="sm" className="bg-white" />
            ) : (
              <>
                <FaPlay />
              </>
            )}
          </Button>
        </div>
      </div>
      {activeTab === "Editor" ? (
        <Editor
          options={{
            minimap: {
              enabled: false,
            },
          }}
          height="calc(100vh - 10rem)"
          theme="vs-light"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value || "")}
        />
      ) : activeTab === "Output" ? (
        <Output output={output} isError={isError} />
      ) : (
        <div className="h-[500px] overflow-scroll">
          <Review getCode={getCode} review={review} />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
