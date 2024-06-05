import https from "node:https";
  
const data = JSON.stringify({
  model: 'gpt-3.5-turbo',
  response_format: { "type": "json_object" },
  messages: [
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Provide a funny story about a ghost"}
  ],
  max_tokens: 60,
  temperature: 0.7,
});

// The options for the HTTPS request
const options = {
  hostname: 'api.openai.com',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
};

// Create the HTTPS request
const req = https.request(options, (res) => {
  let responseBody = '';

  // Collect the data as it comes in
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  // The whole response has been received. Print it out.
  res.on('end', () => {
    if (res.statusCode === 200) {
        const response = JSON.parse(responseBody);
        console.log(response.choices[0].message.content);
    } else {
      console.error('Request failed:', res.statusCode, responseBody);
    }
  });
});

// Handle any errors with the request
req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write the data to the request body
req.write(data);

// End the request
req.end();