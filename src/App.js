import React, { useState } from "react";
import "./App.css";

const Code = ({ text, setText }) => {
  return (
    <div style={{ padding: "16px", display: "flex" }}>
      <input className="code-input" value={text} onChange={setText} />
    </div>
  );
};

const Token = ({ value, definition }) => {
  return (
    <div className="token">
      <span className="token-symbol">{value}</span>
      <span className="token-description">{definition}</span>
    </div>
  );
};

const Tokens = ({ items }) => {
  return (
    <div className="code-tokens">
      {items.map((item) => (
        <Token value={item.token} definition={item.definition} />
      ))}
    </div>
  );
};

function App() {
  const RESERVED = [
    { reg: /continue/, value: "continue" },
    { reg: /abstract/, value: "abstract" },
    { reg: /assert/, value: "assert" },
    { reg: /break/, value: "break" },
    { reg: /class/, value: "class" },
    { reg: /const/, value: "const" },
    { reg: /default/, value: "default" },
    { reg: /enum/, value: "enum" },
    { reg: /extends/, value: "extends" },
    { reg: /final/, value: "final" },
    { reg: /finally/, value: "finally" },
    { reg: /implements/, value: "implements" },
    { reg: /import/, value: "import" },
    { reg: /instanceof/, value: "instanceof" },
    { reg: /interface/, value: "interface" },
    { reg: /native/, value: "native" },
    { reg: /new/, value: "new" },
    { reg: /package/, value: "package" },
    { reg: /private/, value: "private" },
    { reg: /protected/, value: "protected" },
    { reg: /public/, value: "public" },
    { reg: /return/, value: "return" },
    { reg: /static/, value: "static" },
    { reg: /strictfp/, value: "strictfp" },
    { reg: /super/, value: "super" },
    { reg: /switch/, value: "switch" },
    { reg: /synchronized/, value: "synchronized" },
    { reg: /this/, value: "this" },
    { reg: /throw/, value: "throw" },
    { reg: /throws/, value: "throws" },
    { reg: /transient/, value: "transient" },
    { reg: /try/, value: "try" },
    { reg: /void/, value: "void" },
    { reg: /volatile/, value: "volatile" },
  ];
  const BOOLEAN_OPERATORS = [
    { reg: /true/, value: "true" },
    { reg: /false/, value: "false" },
  ];
  const CONTROL_STRUCTURES = [
    { reg: /do/, value: "do" },
    { reg: /else/, value: "else" },
    { reg: /for/, value: "for" },
    { reg: /if/, value: "if" },
    { reg: /try/, value: "try" },
    { reg: /while/, value: "while" },
    { reg: /catch/, value: "catch" },
    { reg: /goto/, value: "goto" },
  ];
  const DATA_TYPE = [
    { reg: /int/, value: "int" },
    { reg: /boolean/, value: "boolean" },
    { reg: /char/, value: "char" },
    { reg: /long/, value: "long" },
    { reg: /short/, value: "short" },
    { reg: /byte/, value: "byte" },
    { reg: /double/, value: "double" },
    { reg: /float/, value: "float" },
  ];
  const ARITHMETIC_OPERATORS = [
    { reg: /\+/, value: "+" },
    { reg: /\-/, value: "-" },
    { reg: /\*/, value: "*" },
    { reg: /\//, value: "/" },
    { reg: /\%/, value: "%" },
  ];
  const ASSIGNATION_OPERATORS = [
    { reg: /\=/, value: "=" },
    { reg: /\+\=/, value: "+=" },
    { reg: /\-\=/, value: "-=" },
    { reg: /\*\=/, value: "*=" },
    { reg: /\%\=/, value: "%*" },
  ];
  const RELATIONAL_OPERATORS = [
    { reg: /\=\=/, value: "==" },
    { reg: /\!\=/, value: "!=" },
    { reg: /\>/, value: ">" },
    { reg: /\</, value: "<" },
    { reg: /\>\=/, value: ">=" },
    { reg: /\<\=/, value: "<=" },
  ];
  const SPECIAL_OPERATORS = [
    { reg: /\+\+/, value: "++" },
    { reg: /\-\-/, value: "--" },
    { reg: /\./, value: "." },
    { reg: /\;/, value: ";" },
  ];
  const GROUP_OPERATORS = [
    { reg: /\(/, value: "(" },
    { reg: /\)/, value: ")" },
    { reg: /\{/, value: "{" },
    { reg: /\}/, value: "}" },
    { reg: /\[/, value: "[" },
    { reg: /\]/, value: "]" },
  ];
  const LOGIC_OPERATORS = [
    { reg: /\&/, value: "&" },
    { reg: /\^/, value: "^" },
    { reg: /\|/, value: "|" },
    { reg: /\&\&/, value: "&&" },
    { reg: /\|\|/, value: "||" },
    { reg: /\?/, value: "?" },
    { reg: /\:/, value: ":" },
  ];
  const STRING_OPERATORS = [
    { reg: /\'/, value: "'" },
    { reg: /\"/, value: '"' },
  ];
  const COMMENTARY_OPERATORS = [
    { reg: /\/\*/, value: "//" },
    { reg: /\*\//, value: "*/" },
    { reg: /\/\//, value: "//" },
  ];

  const [text, setText] = useState("");
  const [tokens, setTokens] = useState([]);

  const search = ({ text, tokens, array, definition }) => {
    //TODO: mapear operadores de comentario y reemplazarlos por un string vacío, al tiempo que si se encuentra coincidencia agregue item a array
    let items = [];
    let str = text;

    array.map((operator) => {
      const regex = new RegExp(operator.reg, "g");
      const isMatch = regex.test(text);
      str = str.replaceAll(regex, "");

      if (isMatch) {
        items = [...items, { token: operator.value, definition }];
      }
    });

    return {
      text: str,
      tokens: [...tokens, ...items],
    };
  };

  const searchReserved = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: RESERVED,
      definition: "Palabra reservada por el lenguaje.",
    });
  };
  const searchBoolean = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: BOOLEAN_OPERATORS,
      definition: "Valor booleano.",
    });
  };
  const searchControlStructures = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: CONTROL_STRUCTURES,
      definition: "Estructura de control",
    });
  };
  const searchDataType = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: DATA_TYPE,
      definition: "Tipo de dato",
    });
  };
  const searchArithmetic = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: ARITHMETIC_OPERATORS,
      definition: "Operador aritmético",
    });
  };
  const searchAssignation = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: ASSIGNATION_OPERATORS,
      definition: "Operador de asignación",
    });
  };
  const searchRelational = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: RELATIONAL_OPERATORS,
      definition: "Operador relacional o de comparación",
    });
  };
  const searchSpecial = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: SPECIAL_OPERATORS,
      definition: "Operador especial",
    });
  };
  const searchGroup = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: GROUP_OPERATORS,
      definition: "Símbolo de agrupación",
    });
  };
  const searchLogic = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: LOGIC_OPERATORS,
      definition: "Operador lógico",
    });
  };
  const searchString = ({ text, tokens }) => {
    return search({
      text,
      tokens,
      array: STRING_OPERATORS,
      definition: "Operador para poder ingresar Strings en el programa.",
    });
  };
  const searchCommentary = ({ text, tokens }) => {
    return search({
      text,
      tokens: [],
      array: COMMENTARY_OPERATORS,
      definition: "Simbolo para poder realizar comentarios en el programa.",
    });
  };

  const onClick = () => {
    setTokens(
      searchReserved(
        searchBoolean(
          searchControlStructures(
            searchDataType(
              searchArithmetic(
                searchAssignation(
                  searchRelational(
                    searchSpecial(
                      searchGroup(
                        searchLogic(
                          searchString(searchCommentary({ text, tokens: [] }))
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ).tokens
    );
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
        <Tokens items={tokens} />
      </div>
    </div>
  );
}

export default App;
