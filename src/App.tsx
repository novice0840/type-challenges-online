import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import * as ts from "typescript";

const challenge = {
  initialCode:
    "function reverseString(str: string): string {\n  // Your code here\n}",
};

interface CompileResult {
  success: boolean;
  diagnostics: string[];
}

const checkForErrors = (code: string): CompileResult => {
  // TypeScript 설정
  const options: ts.CompilerOptions = {
    noEmitOnError: true,
    strict: true,
    target: ts.ScriptTarget.ES2015,
  };

  // 기본 라이브러리 로드
  const defaultLib = ts.getDefaultLibFilePath(options);

  const file = ts.createSourceFile(
    "temp.ts",
    code,
    ts.ScriptTarget.ES2015,
    true
  );

  const program = ts.createProgram(["temp.ts"], options, {
    getSourceFile: (fileName) => (fileName === "temp.ts" ? file : undefined),
    writeFile: () => {},
    getDefaultLibFileName: () => defaultLib, // 기본 라이브러리 파일 경로 제공
    useCaseSensitiveFileNames: () => true,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => "",
    getNewLine: () => "\n",
    fileExists: (fileName) => fileName === "temp.ts",
    readFile: (fileName) =>
      fileName === defaultLib ? ts.sys.readFile(defaultLib) : undefined, // 기본 라이브러리 읽기
    directoryExists: () => true,
    getDirectories: () => [],
  });

  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length === 0) {
    return { success: true, diagnostics: [] };
  }

  const errorMessages = diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      return `Error ${diagnostic.file.fileName} (${line + 1},${
        character + 1
      }): ${message}`;
    }
    return `Error: ${message}`;
  });

  return { success: false, diagnostics: errorMessages };
};

const App = () => {
  const [code, setCode] = useState(challenge.initialCode);

  const handleSubmit = () => {
    // console.log(code);
    const result = checkForErrors(code);
    console.log(result);
  };

  return (
    <div>
      <button onClick={handleSubmit}>제출하기</button>
      <CodeEditor code={code} onCodeChange={setCode} />
    </div>
  );
};

export default App;
