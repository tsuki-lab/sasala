import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const wrapUpOpenAI = async (text: string, model = 'gpt-3.5-turbo') => {
  const systemContent = `# 依頼内容
  要約してください。

  # 依頼内容の制約
  要約50文字以内に収めてください。`

  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        { role: 'user', content: text },
      ],
    })

    const answer = response.data.choices[0].message?.content
    return answer
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      throw new Error(error.message)
    }
    throw new Error('Unknown error')
  }
}
