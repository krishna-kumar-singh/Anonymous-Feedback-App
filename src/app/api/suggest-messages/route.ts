import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string separated by '||'. Avoid personal or sensitive topics.";

    // MUST use stream: true
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // THIS LINE IS CRITICAL
    const stream = OpenAIStream(response);

    // THIS LINE IS CRITICAL
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "OpenAI failed",
      }),
      { status: 500 }
    );
  }
}
