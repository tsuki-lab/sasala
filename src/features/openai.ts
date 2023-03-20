import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const wrapUpOpenAI = async (text: string, model = 'gpt-3.5-turbo') => {
  const content = `${text}

  # 依頼内容
  上記内容を要約してください。

  下記の制約事項に要約文を構成してください。
  ## 制約事項
  - 「~です。」「~ます。」を利用する。
  - 学校の先輩に伝えるような言い回しをする。
  - 女の子の言い回しをする。
  - 感嘆符を用いる。
  - 文末に必ず「みたい」を用いる。

  また、要約文は100文字以内に収めてください。`
  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: [{ role: 'user', content: content }],
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
