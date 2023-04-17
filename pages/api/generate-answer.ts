import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResponseData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const prompt = req.body.prompt;

  if (!prompt || prompt === "") {
    return new Response("프롬프트를 보내주세요!", { status: 400 });
  }

  //api reference
  const aiResult = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${prompt}`,
    max_tokens: 2048,
    temperature: 0,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });

  const response =
    aiResult.data.choices[0].text?.trim() || "문제가 발생하였습니다!";
  res.status(200).json({ text: response });
}
