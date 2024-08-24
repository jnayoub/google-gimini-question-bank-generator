import model from "../services/gemini-model-connection.js";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
async function callGeminiPromptExisting(text, numberOfQuestions) {
  console.log(text);
  console.log(numberOfQuestions);
  const generationConfig = {
    temperature: 0.5,
    topK: 30,
    topP: 0.7,
    maxOutputTokens: 16384,
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.ARRAY,
      items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          question: {
            type: FunctionDeclarationSchemaType.STRING,
          },
          answers: {
            type: FunctionDeclarationSchemaType.ARRAY,
            items: {
              type: FunctionDeclarationSchemaType.STRING,
            },
          },
          correctAnswerIndex: {
            type: FunctionDeclarationSchemaType.NUMBER,
          },
          correctFeedback: {
            type: FunctionDeclarationSchemaType.STRING,
          },
          incorrectFeedback: {
            type: FunctionDeclarationSchemaType.STRING,
          },
        },
        required: [
          "question",
          "answers",
          "correctAnswerIndex",
          "correctFeedback",
          "incorrectFeedback",
        ],
      },
    },
  };

  const parts = [{ text }];

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig,
      systemInstruction: `You will be given a series of questions and correct answers (tab delimited). Each line will be a new question/answer set. I need you to take those questions and generate new questions based on the same question and answers. No new information should be provided. Just reword the same questions to generate ${numberOfQuestions}. Be careful not to combine questions and answers. Only generate a new question from the information in one of the provided question/answer sets. Be careful not to introduce any new information. Only use the information provided in the question/answer. Basically just rewrite it and create distractors that fit the theme of the correct answer. 
      `,
    });

    const response = result.response;
    return response;
  } catch (error) {
    console.error("Error processing or parsing response:", error);
    if (error instanceof SyntaxError) {
      console.error(
        "Failed to parse JSON. Possible incomplete or malformed JSON:",
        error.message
      );
    }
    throw new Error("Failed to process response or parse JSON");
  }
}

export { callGeminiPromptExisting };
