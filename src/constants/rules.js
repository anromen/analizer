export const DEFINITION = {
  type: "definition",
  parts: {
    scope: {
      type: "keyword",
      content: ["private", "public", "protected"],
      optional: true,
    },
    addition: {
      type: "keyword",
      content: ["static", "const"],
    },
    dataType: {
      type: "keyword",
      content: [
        "byte",
        "short",
        "int",
        "long",
        "float",
        "double",
        "boolean",
        "char",
        "void",
        "String",
      ],
      optional: false,
    },
    name: {
      type: "identifier",
      optional: false,
    },
    endSentence: {
      content: [";"],
      optional: false,
      type: "separator",
    },
  },
};

export const ASSIGNMENT = {
  type: "assigment",
  parts: {
    name: {
      type: "identifier",
    },
    operator: {
      content: ["="],
      type: "assigment_operator",
    },
    value: {
      type: "literal",
    },
    endSentence: {
      content: [";"],
      type: "separator",
    },
  },
};

export const DEFINITION_AND_ASSIGMENT = {
  type: "definition",
  subType: "definition-and-assigment",
  parts: {
    scope: {
      type: "keyword",
      content: ["private", "public", "protected"],
    },
    addition: {
      type: "keyword",
      content: ["static"],
    },
    dataType: {
      type: "keyword",
      content: [
        "byte",
        "short",
        "int",
        "long",
        "float",
        "double",
        "boolean",
        "void",

        "char",
        "String",
      ],
    },
    name: {
      type: "identifier",
    },
    operator: {
      content: ["="],
      type: "assigment_operator",
    },
    value: {
      type: "literal",
    },
    endSentence: {
      content: [";"],
      type: "separator",
    },
  },
};

export const PARAM_GROUP = {
  type: "param-group",
  parts: {
    openGroup: { type: "separator", content: ["("] },
    sentences: { type: "param" },
    closeGroup: { type: "separator", content: [")"] },
  },
};

export const SENTENCES_GROUP = {
  type: "sentence",
  subType: "group-sentence",
  parts: {
    openGroup: { type: "separator", content: ["{"] },
    sentences: { type: "sentence", optional: true },
    closeGroup: { type: "separator", content: ["}"] },
  },
};

export const METHOD_DEFINITION = {
  type: "definition",
  parts: {
    scope: {
      type: "keyword",
      content: ["private", "public", "protected"],
    },
    addition: {
      type: "keyword",
      content: ["static"],
    },
    dataType: {
      type: "keyword",
      content: [
        "byte",
        "short",
        "int",
        "long",
        "float",
        "double",
        "boolean",
        "char",
        "void",
        "String",
      ],
    },
    name: {
      type: "identifier",
    },
    params: PARAM_GROUP,
    sentences: SENTENCES_GROUP,
  },
};

export const CLASS_DEFINITION = {
  type: "definition",
  parts: {
    scope: {
      type: "keyword",
      content: ["private", "public", "protected"],
    },
    addition: {
      type: "keyword",
      content: ["static"],
    },
    dataType: {
      type: "keyword",
      content: ["class"],
    },
    name: {
      type: "identifier",
    },
    sentences: {
      type: "group-sentence",
    },
  },
};

export const PARAM = {
  type: "param",
  parts: {
    dataType: {
      type: "keyword",
      content: [
        "byte",
        "short",
        "int",
        "long",
        "float",
        "double",
        "boolean",
        "char",
        "void",
        "String",
      ],
    },
    identifier: {
      type: "idenfitier",
    },
  },
};

export const IDENTIFIER = {
  type: "identifier",
  parts: {
    name: { type: "literal" },
    openGroup: { type: "separator", content: ["[", "("] },
    group: { type: "identifier" },
    closeGroup: { type: "separator", content: ["]", ")"] },
  },
};
