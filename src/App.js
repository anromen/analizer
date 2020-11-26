import React, { useState } from "react";
import "./App.css";

const Code = ({ text, setText }) => {
  return (
    <div style={{ padding: "16px", display: "flex" }}>
      <input className="code-input" value={text} onChange={setText} />
    </div>
  );
};

const Token = () => {
  return (
    <div className="token">
      <span className="token-symbol">&</span>
      <span className="token-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec justo
        consectetur, mollis elit nec, feugiat ipsum. Vestibulum ut finibus nisi.
        Proin porttitor congue ornare. Etiam a facilisis massa. Nullam placerat
        leo justo, at rutrum lacus tempor vel. Pellentesque ac nibh maximus,
        rhoncus lectus at, vehicula nunc.
      </span>
    </div>
  );
};

const Tokens = () => {
  return (
    <div className="code-tokens">
      <Token />
    </div>
  );
};

function App() {
  const RESERVED = [
    "continue",
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extends",
    "final",
    "finally",
    "float",
    "for",
    "goto",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "native",
    "new",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "try",
    "void",
    "volatile",
    "while",
  ];
  const CONTROL_STRUCTURES = [
    "do",
    "else",
    "for",
    "if",
    "try",
    "while",
    "catch",
  ];
  const DATA_TYPE = [
    "int",
    "boolean",
    "char",
    "long",
    "short",
    "byte",
    "double",
    "float",
  ];
  const ARITHMETIC_OPERATORS = ["/+/", "/-/", "/*/", "///", "/%/"];
  const ASSIGNATION_OPERATORS = ["/=/", "/+=/", "/-=/", "/*=/", "/%=/"];
  const RELATIONAL_OPERATORS = ["/==/", "/!=/", "/>/", "/</", "/>=/", "/<=/"];
  const SPECIAL_OPERATORS = ["/++/", "/--/", "/./"];
  const GROUP_OPERATORS = ["/(/", "/)/", "/{/", "/}/", "/[/", "/]/"];
  const LOGIC_OPERATORS = ["/&/", "/^/", "/|/", "/&&/", "/||/", "/?/", "/:/"];
  const STRING_OPERATORS = ['/"/', "/'/"];
  const COMMENTARY_OPERATORS = ["//*/", "///", "/*//"];

  const [text, setText] = useState("");

  const searchCommentary = ({ text, tokens }) => {
    //TODO: mapear operadores de comentario y reemplazarlos por un string vacío, al tiempo que si se encuentra coincidencia agregue item a array
    let items = [];

    COMMENTARY_OPERATORS.map((reg) => {
      const isMatch = reg.test(text);
      //

      if (isMatch) {
        items = [...items, reg];
      }
    });

    return {
      text: "",
      tokens: [...tokens, ...items],
    };
  };

  const onClick = () => {
    searchCommentary(searchString(searchLogic()));

    const separatedBySpace = text.split(" ");
  };

  return (
    <div className="app">
      <div className="wrapper">
        <Code text={text} setText={(e) => setText(e.target.value)} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="input-button" onClick={onClick}>
            Analizar
          </button>
        </div>
        <Tokens />
      </div>
    </div>
  );
}

export default App;
