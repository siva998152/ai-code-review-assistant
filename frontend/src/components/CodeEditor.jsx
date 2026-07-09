import Editor from "@monaco-editor/react";

function CodeEditor() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>JavaScript Code Editor</h2>

      <Editor
        height="500px"
        defaultLanguage="javascript"
        theme="vs-dark"
        defaultValue={`// Paste your JavaScript code here

function hello() {
  console.log("Hello World");
}
`}
      />
    </div>
  );
}

export default CodeEditor;