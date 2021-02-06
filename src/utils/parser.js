import {
  dealWithDefinitions,
  dealWithGroups,
} from "../constants/parserHelpers";

const objectToTree = (tree, level) => {
  const partValues = Object.values(tree.parts);
  let result = "";

  partValues.map((value) => {
    if (Array.isArray(value)) {
      value.map((v) => (result += objectToTree(v, level + 1)));
    } else if (Object.keys(value).includes("parts")) {
      result += objectToTree(value, level + 1);
    } else {
      result += `${"___".repeat(level)}${value.value}\n`;
    }
  });

  return result;
};

export const parser = (tokens) => {
  try {
    const [tree] = dealWithGroups(tokens, 0);

    return objectToTree(tree[0], 0);
  } catch (e) {
    throw e;
  }
};
