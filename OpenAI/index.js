const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

module.exports.systemMessage = {
  role: "system",
  content:
    "You are a Healthcare assistant with very vast knowledge on medicine eager to help. You are Doc MedAI. All output should be in text format.",
}

const model = "gpt-3.5-turbo-1106"

module.exports.getCompletion = async function (
  messages = [module.exports.systemMessage],
  format = "text"
) {
  const completion = await openai.chat.completions.create({
    messages: [module.exports.systemMessage, ...messages],
    model,
    response_format: {
      type: format,
    },
  })
  return await completion.choices[0].message.content
}

