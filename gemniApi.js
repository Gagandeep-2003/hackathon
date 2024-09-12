// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.AIzaSyB6hn2AoVzBvRH8KbHa1gAFXoZWP0UszoU; // Use your actual environment variable for the API key
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function run() {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [],
//   });

//   const result = await chatSession.sendMessage("Who is Virat Kohli?");
//   console.log(result.response.text());
// }

// run();
