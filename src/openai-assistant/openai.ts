import https from "node:https";

export const completeWithChatGPT = (
  prompt: string,
  outputFormat: string,
  tokenCallback: (text: string) => void,
  endCallback: () => void,
  options: object = {}
) => {
  const req = https.request(
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
    (res) => {
      let responseBody = "";

      // Collect the data as it comes in
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      // The whole response has been received. Print it out.
      res.on("end", () => {
        if (res.statusCode === 200) {
          const response = JSON.parse(responseBody);
          tokenCallback(response.choices[0].message.content);
          endCallback();
        } else {
          console.error("Request failed:", res.statusCode, responseBody);
        }
      });
    }
  );

  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 512,
    // top_p: 1.0,
    // frequency_penalty: 0.5,
    // presence_penalty: 0.7,
    // stream: true,
    ...options,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant designed to output JSON. For any output use the provided format ${outputFormat}.`,
      },
      { role: "user", content: prompt },
    ],
  });

  req.on("error", (e) => {
    console.error("Problem with request:" + e.message);
  });

  req.write(data);
  req.end();
};
