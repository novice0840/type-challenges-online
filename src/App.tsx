import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

const App = () => {
  const [code, setCode] = useState("function hello() { return 'Hello World'; }");
  const [errors, setErrors] = useState<monaco.editor.IMarker[]>([]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Monaco Editor가 마운트된 후 실행되는 함수

    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        console.log(model.uri);
        setErrors(markers); // 에러를 상태로 저장
      }
    });
  };

  return (
    <div>
      <h3>Monaco TypeScript Error Detection</h3>
      <MonacoEditor
        height="500px"
        defaultLanguage="typescript"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
      />
      <div>
        <h4>Errors:</h4>
        {errors.length > 0 ? (
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                {error.message} (Line: {error.startLineNumber}, Column: {error.startColumn})
              </li>
            ))}
          </ul>
        ) : (
          <p>No errors</p>
        )}
      </div>
    </div>
  );
};

export default App;
