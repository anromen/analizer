const KEYWORDS = [
  "abstract",
  "default",
  "goto",
  "null",
  "synchronized",
  "boolean",
  "do",
  "if",
  "package",
  "this",
  "break",
  "double",
  "implements",
  "private",
  "throw",
  "byte",
  "else",
  "import",
  "protected",
  "throws",
  "case",
  "extends",
  "instanceof",
  "public",
  "transient",
  "catch",
  "int",
  "return",
  "char",
  "final",
  "interface",
  "short",
  "try",
  "class",
  "finally",
  "long",
  "static",
  "void",
  "const",
  "float",
  "native",
  "super",
  "volatile",
  "continue",
  "for",
  "new",
  "switch",
  "while",
];
const NON_ASSIGMENT_OPERATORS = [
  "+",
  "-",
  "<=",
  "^",
  "++",
  "<",
  "*",
  ">=",
  "%",
  "--",
  "/",
  "!=",
  "?",
  ">>",
  "!",
  "&",
  "==",
  ":",
  ">>",
  "~",
  "|",
  "&&",
  ">>>",
];
const ASSIGMENT_OPERATORS = [
  "=",
  "-=",
  "*=",
  "/=",
  "|=",
  "&=",
  "^=",
  "+=",
  "%=",
  "<<=",
  ">>=",
  ">>>=",
];
const SEPARATORS = ["(", ")", "{", "}", "[", "]", ";", ",", ".", '"'];
const BOOLEAN_LITERALS = ["true", "false"];

export const tokenize = (text) => {
  return getStringLiterals(lexer([...text, "\n"]));
};

//CONDITIONALS FOR CHECK TOKEN TYPE
const isSingleLineComment = (symbols) =>
  symbols?.length >= 2 && /\//.test(symbols[0]) && /\//.test(symbols[1]);

const isMultiLineComment = (symbols) =>
  symbols?.length >= 2 && /\//.test(symbols[0]) && /\*/.test(symbols[1]);
const isNonZeroDigit = (text) => /^[1-9]\d*[lL]?$/.test(text);
const isHexDigit = (text) => /^0[xX]([0-9]|[a-f])+$/.test(text);
const isOctalDigit = (text) => /^0[0-7]+$/.test(text);
const isFloatingPointLiteral = (text) =>
  /^((\d*\.\d*[eE]?[\+\-]?\d+[fFdD]?)|(\d+[eE][\+\-]?\d+[fFdD]?))$/.test(text);
const isCharLiteral = (text) =>
  /'(([^'\\])|(\\([btnfr"'\\]|[0123]?[0-7]))|(\\u[0-9]{4}))'/.test(text);
const isStringLiteral = (text) =>
  /"(([^'\\])|(\\([btnfr"'\\]|[0123]?[0-7]))|(\\u[0-9]{4}))*"/.test(text);

//HELPERS
const getSingleLineComment = (symbols) => {
  let comment = "";
  let currentSymbolIndex = 0;

  while (symbols[currentSymbolIndex] !== "\n") {
    comment += symbols[currentSymbolIndex];
    currentSymbolIndex++;
  }

  return [comment, currentSymbolIndex];
};
const getMultiLineComment = (symbols) => {
  let comment = "";
  let currentSymbolIndex = 0;

  while (true) {
    comment += symbols[currentSymbolIndex];
    currentSymbolIndex++;

    if (comment.substr(-2) === "*/") {
      break;
    }
  }

  return [comment, currentSymbolIndex];
};
const getWord = (symbols) => {
  let word = "";
  let currentSymbolIndex = 0;

  while (/\s/.test(symbols[currentSymbolIndex])) {
    currentSymbolIndex++;
  }

  while (
    !/\s/.test(symbols[currentSymbolIndex]) &&
    !!symbols[currentSymbolIndex]
  ) {
    word += symbols[currentSymbolIndex];
    currentSymbolIndex++;
  }

  return [word, currentSymbolIndex];
};
const getStringLiterals = (tokens) => {
  const newTokens = [];
  let isOnString = false;
  let currentString = "";

  tokens.map((token) => {
    if (isOnString && !/"/.test(token.value)) {
      currentString +=
        currentString.length > 1 ? ` ${token.value}` : token.value;
      return;
    }
    if (isOnString && /"/.test(token.value)) {
      currentString += '"';
      isOnString = false;
      newTokens.push({ value: currentString, type: "string_literal" });
      currentString = "";
      return;
    }
    if (!isOnString && /"/.test(token.value)) {
      currentString += '"';
      isOnString = true;
      return;
    }
    newTokens.push(token);
  });

  return newTokens;
};
const splitIdentifierTokens = (literal) => {
  return literal
    .replaceAll(/\(/g, " ( ")
    .replaceAll(/\)/g, " ) ")
    .replaceAll(/\{/g, " { ")
    .replaceAll(/\}/g, " } ")
    .replaceAll(/\;/g, " ; ")
    .replaceAll(/\./g, " . ")
    .replaceAll(/"/g, ' " ')
    .replaceAll(/,/g, " , ");
};

const lexer = (symbols, flag = false) => {
  if (!symbols?.length) return [];
  if (/\s/.test(symbols[0])) return lexer(symbols.slice(1));

  //COMMENTS
  if (isSingleLineComment(symbols)) {
    let [comment, lastIndex] = getSingleLineComment(symbols);
    return [
      { value: comment, type: "single_comment" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }
  if (isMultiLineComment(symbols)) {
    let [comment, lastIndex] = getMultiLineComment(symbols);
    return [
      { value: comment, type: "multiline_comment" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //KEYWORDS
  let [word, lastIndex] = getWord(symbols);

  if (KEYWORDS.includes(word)) {
    return [
      { value: word, type: "keyword" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //OPERATOR
  if (NON_ASSIGMENT_OPERATORS.includes(word)) {
    return [
      { value: word, type: "non_assigment_operator" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }
  if (ASSIGMENT_OPERATORS.includes(word)) {
    return [
      { value: word, type: "assigment_operator" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //SEPARATOR
  if (SEPARATORS.includes(word)) {
    return [
      { value: word, type: "separator" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //LITERALS
  //________INTEGER
  if (isNonZeroDigit(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }
  if (isHexDigit(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }
  if (isOctalDigit(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //________FLOATING POINT
  if (isFloatingPointLiteral(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //________BOOLEAN
  if (BOOLEAN_LITERALS.includes(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //________CHARACTER
  if (isCharLiteral(word)) {
    return [
      { value: word, type: "literal" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  //IDENTIFIERS
  const identifier = splitIdentifierTokens(word);

  if (identifier === word) {
    return [
      { value: identifier, type: "identifier" },
      ...lexer(symbols.slice(lastIndex + 1)),
    ];
  }

  return [...lexer([...identifier]), ...lexer(symbols.slice(lastIndex + 1))];
};
