import {
  ASSIGNMENT,
  DEFINITION,
  DEFINITION_AND_ASSIGMENT,
  CLASS_DEFINITION,
  SENTENCES_GROUP,
  IDENTIFIER,
  PARAM,
  METHOD_DEFINITION,
} from "./rules";

export const dealWithGroups = (tokens, index) => {
  if (!tokens?.length) {
    return null;
  }

  const endToken = tokens[index]?.value === "{" ? "}" : null;
  let currentIndex = endToken ? index + 1 : index;
  const sentences = [];

  while ((endToken && tokens[currentIndex].value !== endToken) || !endToken) {
    try {
      const [ifResult, ifIndex] = deailWithIf(tokens, currentIndex);
      if (ifResult) sentences.push(ifResult);

      const [whileResult, whileIndex] = deailWithWhile(tokens, ifIndex);
      if (whileResult) sentences.push(whileResult);

      const [definition, indexDefinition] = dealWithDefinitions(
        tokens,
        whileIndex
      );

      if (definition) sentences.push(definition);

      const newIndex =
        indexDefinition === currentIndex
          ? indexDefinition + 1
          : indexDefinition;

      if (newIndex >= tokens.length) break;

      currentIndex = newIndex;
    } catch (e) {
      throw e;
    }
  }

  return [sentences, currentIndex];
};

export const dealWithLiteralGroup = (tokens, index) => {
  const endToken =
    tokens[index].value === "("
      ? ")"
      : tokens[index].value === "["
      ? "]"
      : null;
  let currentIndex = index + 1;
  const literals = [];

  if (!endToken) {
    return [null, index];
  }

  if (tokens[currentIndex].value === endToken) {
    return [[], currentIndex + 1];
  }

  while (true) {
    if (tokens[currentIndex].type === "literal") {
      literals.push(tokens[currentIndex]);

      if (tokens[currentIndex + 1].value === endToken) {
        currentIndex += 1;
        break;
      } else if (tokens[currentIndex + 1].value === ",") {
        if (
          tokens[currentIndex + 2].type === "identifier" ||
          tokens[currentIndex + 2].type === "literal"
        ) {
          currentIndex += 2;
        } else {
          throw "Valor inválido al definir paramétros";
        }
      } else {
        throw "Se esperaba una coma ','";
      }
    } else if (tokens[currentIndex].type === "identifier") {
      const [identifier, newIndex] = dealWithIdentifier(tokens, currentIndex);

      if (identifier) literals.push(identifier);

      if (tokens[newIndex].value === endToken) {
        currentIndex += 1;
        break;
      } else if (tokens[newIndex].value === ",") {
        if (
          tokens[newIndex + 1].type === "identifier" ||
          tokens[newIndex + 1].type === "literal"
        ) {
          currentIndex = newIndex + 1;
        } else {
          throw "Valor inválido al definir paramétros";
        }
      } else {
        throw "Se esperaba una coma ','";
      }
    }
  }

  return [literals, currentIndex];
};

export const dealWithIdentifier = (tokens, index) => {
  if (tokens[index].type === "identifier" || tokens[index].type === "literal") {
    if (IDENTIFIER.parts.openGroup.content.includes(tokens[index + 1])) {
      const [group, newIndex] = dealWithLiteralGroup();
      const endToken =
        tokens[index].value === "("
          ? ")"
          : tokens[index].value === "["
          ? "]"
          : null;

      return [
        {
          type: tokens[index].type,
          parts: {
            name: tokens[index],
            openGroup: tokens[index + 1],
            group,
            closeGroup: endToken,
          },
        },
        newIndex + 1,
      ];
    } else {
      return [
        { type: tokens[index].type, parts: { name: tokens[index] } },
        index + 1,
      ];
    }
  }

  return [null, index];
};

export const dealWithParamsDefinition = (tokens, index) => {
  let currentIndex = index + 1;
  const params = [];

  if (tokens[index + 1].value === ")") {
    return [
      {
        type: "params",
        parts: {
          params,
        },
      },
      index + 2,
    ];
  }

  while (true) {
    if (PARAM.parts.dataType.content.includes(tokens[currentIndex].value)) {
      const [literal, newIndex] = dealWithIdentifier(tokens, currentIndex + 1);

      if (literal) {
        params.push({
          type: "param",
          parts: {
            dataType: tokens[currentIndex],
            identifier: literal,
          },
        });

        if (tokens[newIndex].value === ")") {
          currentIndex = newIndex + 1;
          break;
        } else if (tokens[newIndex].value === ",") {
          currentIndex = newIndex + 1;
        } else {
          throw "Elemento no identificado";
        }
      } else {
        console.log("#uwu4");
        throw "El tipo de dato del parametro es necesario";
      }
    }
  }

  return [
    {
      type: "params",
      parts: {
        params,
      },
    },
    currentIndex,
  ];
};

export const deailWithIf = (tokens, i) => {
  if (tokens[i].value === "if") {
    if (tokens[i + 1].value === "(") {
      if (tokens[i + 2].value === "true" || tokens[i + 2].value === "false") {
        if (tokens[i + 3].value === ")") {
          //uwuwuwuw
          if (tokens[i + 4].value === "{") {
            const [sentences, sentencesIndex] = dealWithGroups(tokens, i + 4);

            return [
              {
                type: "conditional",
                parts: {
                  function: tokens[i],
                  condition: {
                    type: "condition",
                    parts: { value: tokens[i + 2] },
                  },
                  sentences,
                },
              },
              sentencesIndex,
            ];
          } else {
            throw "El condicional esperaba una sentencia para terminar";
          }
        } else {
          throw "Se esperaba un ')'";
        }
      } else {
        throw "Argumentos del condicional inválidos";
      }
    } else {
      throw "El if no tiene argumentos";
    }
  }

  return [null, i];
};

export const deailWithWhile = (tokens, i) => {
  if (tokens[i].value === "while") {
    if (tokens[i + 1].value === "(") {
      if (tokens[i + 2].value === "true" || tokens[i + 2].value === "false") {
        if (tokens[i + 3].value === ")") {
          if (tokens[i + 4].value === "{") {
            const [sentences, sentencesIndex] = dealWithGroups(tokens, i + 4);

            return [
              {
                type: "conditional",
                parts: {
                  function: tokens[i],
                  condition: {
                    type: "condition",
                    parts: { value: tokens[i + 2] },
                  },
                  sentences,
                },
              },
              sentencesIndex,
            ];
          } else {
            throw "El condicional esperaba una sentencia para terminar";
          }
        } else {
          throw "Se esperaba un ')'";
        }
      } else {
        throw "Argumentos del condicional inválidos";
      }
    } else {
      throw "El while no tiene argumentos";
    }
  }

  return [null, i];
};

export const dealWithDefinitions = (tokens, i) => {
  if (!tokens.length || i >= tokens.length) {
    return [null, i];
  }

  //public, private, protected
  if (DEFINITION.parts.scope.content.includes(tokens[i].value)) {
    //static
    if (DEFINITION.parts.addition.content.includes(tokens[i + 1].value)) {
      //int, float, char
      if (DEFINITION.parts.dataType.content.includes(tokens[i + 2].value)) {
        //nombre de variable
        if (tokens[i + 3].type === DEFINITION.parts.name.type) {
          //punto y coma
          if (
            DEFINITION.parts.endSentence.content.includes(tokens[i + 4].value)
          ) {
            //public static int a;
            return [
              {
                type: "definition",
                parts: {
                  scope: tokens[i],
                  addition: tokens[i + 1],
                  dataType: tokens[i + 2],
                  name: tokens[i + 3],
                  endSentence: tokens[i + 4],
                },
              },
              i + 5,
            ];
            // Signo de asignación
          } else if (
            DEFINITION_AND_ASSIGMENT.parts.operator.content.includes(
              tokens[i + 4].value
            )
          ) {
            //TODO: Reducción del literal
            //Literales: 1, "whatever", 2.3
            if (
              DEFINITION_AND_ASSIGMENT.parts.value.type === tokens[i + 5].type
            ) {
              //Punto y coma
              if (
                DEFINITION_AND_ASSIGMENT.parts.endSentence.content.includes(
                  tokens[i + 6]?.value
                )
              ) {
                //public static int a = 3;
                return [
                  {
                    type: "definition-and-assigment",
                    parts: {
                      scope: tokens[i],
                      addition: tokens[i + 1],
                      dataType: tokens[i + 2],
                      name: tokens[i + 3],
                      operator: tokens[i + 4],
                      value: tokens[i + 5],
                      endSentence: tokens[i + 6],
                    },
                  },
                  i + 7,
                ];
              } else {
                throw "Hace falta un punto y coma";
              }
            } else {
              throw "Es necesario un literal después de la asignación";
            }
          } else if (
            METHOD_DEFINITION.parts.params.parts.openGroup.content.includes(
              tokens[i + 4].value
            )
          ) {
            const [params, paramsIndex] = dealWithParamsDefinition(
              tokens,
              i + 4
            );
            // {...}
            if (tokens[paramsIndex].value === "{") {
              const [sentences, sentencesIndex] = dealWithGroups(
                tokens,
                paramsIndex
              );

              //public static void main() {...}
              return [
                {
                  type: "definition",
                  parts: {
                    scope: tokens[i],
                    addition: tokens[i + 1],
                    dataType: tokens[i + 2],
                    name: tokens[i + 3],
                    params: params,
                    sentences: sentences,
                  },
                },
                sentencesIndex + 1,
              ];
            }
          } else {
            throw "Hace falta un punto y coma";
          }
        } else {
          throw "El nombre de variable es necesario";
        }
        //class
      } else if (
        CLASS_DEFINITION.parts.dataType.content.includes(tokens[i + 2].value)
      ) {
        //Identifador
        if (tokens[i + 3].type === DEFINITION.parts.name.type) {
          // Apertura de llaves
          if (
            SENTENCES_GROUP.parts.openGroup.content.includes(
              tokens[i + 4].value
            )
          ) {
            const [sentences, newIndex] = dealWithGroups(tokens, i + 4);

            //public static class Main {...}
            return [
              {
                type: "definition",
                parts: {
                  scope: tokens[i],
                  addition: tokens[i + 1],
                  dataType: tokens[i + 2],
                  name: tokens[i + 3],
                  sentences: sentences,
                },
              },
              newIndex,
            ];
          } else {
            throw "Hace falta una llave '{'";
          }
        } else {
          throw "El nombre de variable es necesario";
        }
      } else {
        console.log("#uwu1");
        throw "El tipo de dato es necesario";
      }
      //int, bool
    } else if (
      DEFINITION.parts.dataType.content.includes(tokens[i + 1].value)
    ) {
      //Identificado
      if (tokens[i + 2].type === DEFINITION.parts.name.type) {
        //Punto y coma
        if (
          DEFINITION.parts.endSentence.content.includes(tokens[i + 3].value)
        ) {
          //public int a;
          return [
            {
              type: "definition",
              parts: {
                scope: tokens[i],
                dataType: tokens[i + 1],
                name: tokens[i + 2],
                endSentence: tokens[i + 3],
              },
            },
            i + 4,
          ];
          //Signo de asignación
        } else if (
          DEFINITION_AND_ASSIGMENT.parts.operator.content.includes(
            tokens[i + 3].value
          )
        ) {
          //TODO: Reducción del literal
          //Literal: 1, true, "whatever"
          if (
            DEFINITION_AND_ASSIGMENT.parts.value.type === tokens[i + 4].type
          ) {
            //Punto y coma
            if (
              DEFINITION_AND_ASSIGMENT.parts.endSentence.content.includes(
                tokens[i + 5]?.value
              )
            ) {
              //public int a = 3;
              return [
                {
                  type: "definition-and-assigment",
                  parts: {
                    scope: tokens[i],
                    dataType: tokens[i + 1],
                    name: tokens[i + 2],
                    operator: tokens[i + 3],
                    value: tokens[i + 4],
                    endSentence: tokens[i + 5],
                  },
                },
                i + 6,
              ];
            } else {
              throw "Hace falta un punto y coma";
            }
          } else {
            throw "Es necesario un literal después de la asignación";
          }
        } else if (
          METHOD_DEFINITION.parts.params.parts.openGroup.content.includes(
            tokens[i + 3].value
          )
        ) {
          const [params, paramsIndex] = dealWithParamsDefinition(tokens, i + 3);
          // {...}
          if (tokens[paramsIndex].value === "{") {
            const [sentences, sentencesIndex] = dealWithGroups(
              tokens,
              paramsIndex
            );

            //public void main() {...}
            return [
              {
                type: "definition",
                parts: {
                  scope: tokens[i],
                  dataType: tokens[i + 1],
                  name: tokens[i + 2],
                  params: params,
                  sentences: sentences,
                },
              },
              sentencesIndex + 1,
            ];
          }
        } else {
          throw "Hace falta un punto y coma";
        }
      } else {
        throw "El nombre de variable es necesario";
      }
      //class
    } else if (
      CLASS_DEFINITION.parts.dataType.content.includes(tokens[i + 1].value)
    ) {
      //Identifador
      if (tokens[i + 2].type === DEFINITION.parts.name.type) {
        // Apertura de llaves
        if (
          SENTENCES_GROUP.parts.openGroup.content.includes(tokens[i + 3].value)
        ) {
          const [sentences, newIndex] = dealWithGroups(tokens, i + 3);

          //public class Main {...}
          return [
            {
              type: "definition",
              parts: {
                scope: tokens[i],
                dataType: tokens[i + 1],
                name: tokens[i + 2],
                sentences: sentences,
              },
            },
            newIndex,
          ];
        } else {
          throw "Hace falta una llave '{'";
        }
      } else {
        throw "El nombre de variable es necesario";
      }
    } else {
      console.log("#uwu2");
      throw "El tipo de dato es necesario";
    }
    //static
  } else if (DEFINITION.parts.addition.content.includes(tokens[i].value)) {
    //int,bool
    if (DEFINITION.parts.dataType.content.includes(tokens[i + 1].value)) {
      //Identificador
      if (tokens[i + 2].type === DEFINITION.parts.name.type) {
        //Punto y coma
        if (
          DEFINITION.parts.endSentence.content.includes(tokens[i + 3].value)
        ) {
          //static int a;
          return [
            {
              type: "definition",
              parts: {
                addition: tokens[i],
                dataType: tokens[i + 1],
                name: tokens[i + 2],
                endSentence: tokens[i + 3],
              },
            },
            i + 4,
          ];
          //Asigación =
        } else if (
          DEFINITION_AND_ASSIGMENT.parts.operator.content.includes(
            tokens[i + 3].value
          )
        ) {
          //Literal: 1, bool, "whatever"
          if (
            DEFINITION_AND_ASSIGMENT.parts.value.type === tokens[i + 4].type
          ) {
            //Punto y coma
            if (
              DEFINITION_AND_ASSIGMENT.parts.endSentence.content.includes(
                tokens[i + 5]?.value
              )
            ) {
              //static int a = 3;
              return [
                {
                  type: "definition-and-assigment",
                  parts: {
                    addition: tokens[i],
                    dataType: tokens[i + 1],
                    name: tokens[i + 2],
                    operator: tokens[i + 3],
                    value: tokens[i + 4],
                    endSentence: tokens[i + 5],
                  },
                },
                i + 6,
              ];
            } else {
              throw "Hace falta un punto y coma";
            }
          } else {
            throw "Es necesario un literal después de la asignación";
          }
        } else if (
          METHOD_DEFINITION.parts.params.parts.openGroup.content.includes(
            tokens[i + 3].value
          )
        ) {
          const [params, paramsIndex] = dealWithParamsDefinition(tokens, i + 3);
          // {...}
          if (tokens[paramsIndex].value === "{") {
            const [sentences, sentencesIndex] = dealWithGroups(
              tokens,
              paramsIndex
            );

            //static void main() {...}
            return [
              {
                type: "definition",
                parts: {
                  addition: tokens[i],
                  dataType: tokens[i + 1],
                  name: tokens[i + 2],
                  params: params,
                  sentences: sentences,
                },
              },
              sentencesIndex + 1,
            ];
          }
        } else {
          throw "Hace falta un punto y coma";
        }
      } else {
        throw "El nombre de variable es necesario";
      }
      //class
    } else if (
      CLASS_DEFINITION.parts.dataType.content.includes(tokens[i + 1].value)
    ) {
      //Identifador
      if (tokens[i + 2].type === DEFINITION.parts.name.type) {
        // Apertura de llaves
        if (
          SENTENCES_GROUP.parts.openGroup.content.includes(tokens[i + 3].value)
        ) {
          const [sentences, newIndex] = dealWithGroups(tokens, i + 3);

          //static class Main {...}
          return [
            {
              type: "definition",
              parts: {
                scope: tokens[i],
                dataType: tokens[i + 1],
                name: tokens[i + 2],
                sentences: sentences,
              },
            },
            newIndex,
          ];
        } else {
          throw "Hace falta una llave '{'";
        }
      } else {
        throw "El nombre de variable es necesario";
      }
    } else {
      console.log("#uwu3");
      throw "El tipo de dato es necesario";
    }
    //int, bool
  } else if (DEFINITION.parts.dataType.content.includes(tokens[i].value)) {
    //Identificador
    if (tokens[i + 1].type === DEFINITION.parts.name.type) {
      //Punto y coma
      if (DEFINITION.parts.endSentence.content.includes(tokens[i + 2].value)) {
        //int a;
        return [
          {
            type: "definition",
            parts: {
              dataType: tokens[i],
              name: tokens[i + 1],
              endSentence: tokens[i + 2],
            },
          },
          i + 3,
        ];
        //Asingación =
      } else if (
        DEFINITION_AND_ASSIGMENT.parts.operator.content.includes(
          tokens[i + 2].value
        )
      ) {
        //TODO: Reducción del literal
        //Literal: 1, true, false, "whatever"
        if (DEFINITION_AND_ASSIGMENT.parts.value.type === tokens[i + 3].type) {
          //Punto y coma
          if (
            DEFINITION_AND_ASSIGMENT.parts.endSentence.content.includes(
              tokens[i + 4]?.value
            )
          ) {
            //int a = 3;
            return [
              {
                type: "definition-and-assigment",
                parts: {
                  dataType: tokens[i],
                  name: tokens[i + 1],
                  operator: tokens[i + 2],
                  value: tokens[i + 3],
                  endSentence: tokens[i + 4],
                },
              },
              i + 5,
            ];
          } else {
            throw "Hace falta un punto y coma";
          }
        } else if (
          METHOD_DEFINITION.parts.params.parts.openGroup.content.includes(
            tokens[i + 3].value
          )
        ) {
          const [params, paramsIndex] = dealWithParamsDefinition(tokens, i + 3);
          // {...}
          if (tokens[paramsIndex].value === "{") {
            const [sentences, sentencesIndex] = dealWithGroups(
              tokens,
              paramsIndex
            );

            //void main() {...}
            return [
              {
                type: "definition",
                parts: {
                  dataType: tokens[i],
                  name: tokens[i + 1],
                  params: params,
                  sentences: sentences,
                },
              },
              sentencesIndex + 1,
            ];
          }
        } else {
          throw "Es necesario un literal después de la asignación";
        }
      } else {
        throw "Hace falta un punto y coma";
      }
    } else {
      throw "El nombre de variable es necesario";
    }
    //class
  } else if (
    CLASS_DEFINITION.parts.dataType.content.includes(tokens[i].value)
  ) {
    //Identifador
    if (tokens[i + 1].type === DEFINITION.parts.name.type) {
      // Apertura de llaves
      if (
        SENTENCES_GROUP.parts.openGroup.content.includes(tokens[i + 2].value)
      ) {
        const [sentences, newIndex] = dealWithGroups(tokens, i + 2);

        //class Main {...}
        return [
          {
            type: "definition",
            parts: {
              scope: tokens[i],
              dataType: tokens[i + 1],
              name: tokens[i + 2],
              sentences: sentences,
            },
          },
          newIndex,
        ];
      } else {
        throw "Hace falta una llave '{'";
      }
    } else {
      throw "El nombre de variable es necesario";
    }
  }

  return [null, i];
};
