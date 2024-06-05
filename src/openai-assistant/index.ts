import { startRequest, getRequest, type Request } from "./request";

// async function checkCompletion(request: Request[keyof Request]) {
//   while (request.pending) {
//     await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
//   }
//   console.log(request.completion);
// }

export async function returnCompletion() {
  const requestId = startRequest(
    `Provide a funny story about a ghost`,
    '{ "title": "string", "story": "string" }'
  );
  const request = getRequest(requestId);
  while (request.pending) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
  }
  return JSON.parse(request.completion); // TODO: safe parse
}

// async function main() {
//   const requestId = startRequest(
//     `Provide a funny story about a ghost`,
//     '{ "title": "string", "story": "string" }'
//   );
//   const request = getRequest(requestId);
//   checkCompletion(request);
// }
// main()
