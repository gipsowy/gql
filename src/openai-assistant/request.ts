import { completeWithChatGPT } from "./openai";

export type Request = Record<
  string,
  {
    completion: string;
    pending: boolean;
  }>
const requests: Request = {};

export const getRequest = (requestId: string) => {
  return requests[requestId];
};

export const startRequest = (prompt: string, outputFormat: string) => {
  const requestId = Math.random().toString(36).substring(2, 15);
  requests[requestId] = {
    completion: "",
    pending: true,
  };

  completeWithChatGPT(
    prompt,
    outputFormat,
    (text) => {
      requests[requestId].completion = text;
    },
    () => {
      requests[requestId].pending = false;
    }
  );

  return requestId;
};
