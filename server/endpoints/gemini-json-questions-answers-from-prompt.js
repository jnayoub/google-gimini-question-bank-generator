import model from "../services/gemini-model-connection.js";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
async function callGeminiPrompt(text, numberOfQuestions) {
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
      systemInstruction: `You are given a specific prompt containing information. So long as you have enough unique information, your task is to generate exactly the ${numberOfQuestions} of multiple-choice questions requested, based solely on the information within the prompt. If there is not enough information provided in the prompt you should only generate as many questions as possible. Do not add any additional information, even if it is factually correct. Only use the details provided in the prompt to generate questions, correct answers, and distractors. The correct answers must match the information in the prompt exactly. If the prompt says 'Family Guy was created in 1980,' the correct answer must reflect this, regardless of any other knowledge you may have. Your response must be in valid JSON format with an array of ${numberOfQuestions} json objects with the following schema for each question.
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

export { callGeminiPrompt };
