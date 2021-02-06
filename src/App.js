import React, { useState } from "react";
import "./App.css";
import { tokenize } from "./utils/lexer";
import { parser } from "./utils/parser";

const TOKEN_TYPES = {
  single_comment: "Comentario de una línea",
  multiline_comment: "Comentario multilínea",
  keyword: "Palabra reservada",
  non_assigment_operator: "Operador",
  assigment_operator: "Operador de asignación",
  separator: "Separador",
  non_zero_number_literal: "Literal númerico",
  hex_number_literal: "Literal numérico hexadecimal",
  octal_number_literal: "Literal numérico octal",
  floating_point_literal: "Literal de coma flotante",
  boolean_literal: "Literal booleano",
  char_literal: "Literal carácter",
  string_literal: "Literal cadena de texto",
  identifier: "Identificador",
};

const Code = ({ text, setText }) => {
  return (
    <div style={{ padding: "16px", display: "flex" }}>
      <textarea
        className="code-input"
        value={text}
        onChange={setText}
        rows={10}
      />
    </div>
  );
};

const Token = ({ value, definition }) => {
  return (
    <div className="token">
      <span className="token-symbol">{value}</span>
      <span className="token-description">{TOKEN_TYPES[definition]}</span>
    </div>
  );
};

const Tokens = ({ items }) => {
  return (
    <div className="code-tokens">
      {items.map((item) => (
        <Token value={item.value} definition={item.type} />
      ))}
    </div>
  );
};

function App() {
  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [tree, setTree] = useState(null);

  const onClick = () => {
    const tokens = tokenize(text);
    setTokens(tokens);

    try {
      const tree = parser(tokens);
      setTree(tree);

      setError(null);
    } catch (e) {
      console.log("#error", e);
      setError(e);
    }
  };

  return (
    <div className="app">
      <div className="wrapper">
        <Code text={text} setText={(e) => setText(e.target.value)} />
        {error && (
          <div
            style={{
              backgroundColor: "#e32929",
              color: "#fbfbfb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="input-button" onClick={onClick}>
            Analizar
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Tokens items={tokens} />
          {tree && (
            <pre style={{ width: "40%", color: "#fff", fontSize: "1.5rem" }}>
              {tree}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
