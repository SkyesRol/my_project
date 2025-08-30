/*
chat 聊天

*/
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions'
export const chat = async (messages,
    api_url = DEEPSEEK_CHAT_API_URL,
    api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
    model = 'deepseek-chat',
    onStream = null) => {
    try {
        const res = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                stream: onStream ? true : false,
            })
        })

        if (onStream) {
            // 流式处理
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let content = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') continue

                        try {
                            const parsed = JSON.parse(data)
                            const delta = parsed.choices?.[0]?.delta?.content
                            if (delta) {
                                content += delta
                                onStream(delta, content)
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }

            return {
                code: 0,
                msg: 'success',
                content
            }
        } else {
            // 非流式处理
            const data = await res.json()
            return {
                code: 0,
                msg: 'success',
                content: data.choices[0].message.content
            }
        }
    } catch (error) {
        return {
            code: -1,
            msg: error.message
        }
    }
}

export const QwenChat = async (messages, onStream = null) => {
    console.log('QwenChat 调用开始:', {
        messages,
        api_url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-plus',
        stream: onStream ? true : false
    })

    try {
        const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_QWEN_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                messages,
                stream: onStream ? true : false
            })
        })

        console.log('代理服务器响应状态:', response.status)
        console.log('响应头:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorText = await response.text()
            console.error('代理服务器错误:', {
                status: response.status,
                statusText: response.statusText,
                errorText
            })
            return {
                code: -1,
                msg: `代理服务器错误: ${response.status} - ${errorText}`
            }
        }

        if (onStream) {
            // 流式处理
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let content = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') continue

                        try {
                            const parsed = JSON.parse(data)
                            const delta = parsed.choices?.[0]?.delta?.content
                            if (delta) {
                                content += delta
                                onStream(delta, content)
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }

            return {
                code: 0,
                msg: 'success',
                content
            }
        } else {
            // 非流式处理
            const responseText = await response.text()
            console.log('原始响应文本:', responseText)

            if (!responseText) {
                console.error('响应为空')
                return {
                    code: -1,
                    msg: '服务器返回空响应'
                }
            }

            let data
            try {
                data = JSON.parse(responseText)
                console.log('QwenChat 调用成功:', data)
            } catch (parseError) {
                console.error('JSON 解析失败:', parseError)
                console.error('响应文本:', responseText)
                return {
                    code: -1,
                    msg: `JSON 解析失败: ${parseError.message}`
                }
            }

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('API 响应格式错误:', data)
                return {
                    code: -1,
                    msg: 'API 响应格式错误'
                }
            }

            return {
                code: 0,
                msg: 'success',
                content: data.choices[0].message.content
            }
        }

    } catch (error) {
        console.error('QwenChat 调用错误:', error)
        return {
            code: -1,
            msg: error.message
        }
    }
}