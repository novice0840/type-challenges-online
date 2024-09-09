import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const handleEditorChange = (value: string | undefined) => {
    onCodeChange(value || "");
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="typescript"
      value={code}
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
