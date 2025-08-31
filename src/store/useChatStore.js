import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { chat, QwenChat } from '@/llm/index'

const useChatStore = create(
    persist(
        (set, get) => ({
            // 聊天会话列表
            conversations: [],
            // 当前活跃的会话ID
            activeConversationId: null,
            // 当前会话的消息列表
            messages: [],
            // 聊天状态
            isLoading: false,
            // 错误信息
            error: null,
            // 当前使用的AI模型
            currentModel: 'deepseek', // 'deepseek' | 'qwen'

            // 创建新会话
            createConversation: () => {
                const conversationId = Date.now().toString()
                const newConversation = {
                    id: conversationId,
                    title: '新对话',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    messageCount: 0
                }

                set(state => ({
                    conversations: [newConversation, ...state.conversations],
                    activeConversationId: conversationId,
                    messages: [],
                    error: null
                }))

                return conversationId
            },

            // 切换会话
            switchConversation: (conversationId) => {
                const conversation = get().conversations.find(c => c.id === conversationId)
                if (conversation) {
                    // 从localStorage加载该会话的消息
                    const savedMessages = localStorage.getItem(`chat_messages_${conversationId}`)
                    const messages = savedMessages ? JSON.parse(savedMessages) : []

                    // 确保所有加载的消息都不处于流式状态
                    const normalizedMessages = messages.map(msg => ({
                        ...msg,
                        isStreaming: false
                    }))

                    set({
                        activeConversationId: conversationId,
                        messages: normalizedMessages,
                        error: null
                    })
                }
            },

            // 删除会话
            deleteConversation: (conversationId) => {
                // 删除消息记录
                localStorage.removeItem(`chat_messages_${conversationId}`)

                set(state => {
                    const newConversations = state.conversations.filter(c => c.id !== conversationId)
                    const newActiveId = state.activeConversationId === conversationId
                        ? (newConversations[0]?.id || null)
                        : state.activeConversationId

                    return {
                        conversations: newConversations,
                        activeConversationId: newActiveId,
                        messages: newActiveId ? get().messages : [],
                        error: null
                    }
                })
            },

            // 添加消息
            addMessage: (message) => {
                const { activeConversationId } = get()
                if (!activeConversationId) return

                const newMessage = {
                    id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    content: message.content,
                    role: message.role, // 'user' | 'assistant'
                    timestamp: new Date().toISOString(),
                    ...message
                }

                set(state => {
                    const newMessages = [...state.messages, newMessage]

                    // 保存消息到localStorage
                    localStorage.setItem(`chat_messages_${activeConversationId}`, JSON.stringify(newMessages))

                    // 更新会话信息
                    const updatedConversations = state.conversations.map(conv => {
                        if (conv.id === activeConversationId) {
                            return {
                                ...conv,
                                title: conv.messageCount === 0 ? message.content.slice(0, 20) + '...' : conv.title,
                                updatedAt: new Date().toISOString(),
                                messageCount: conv.messageCount + 1
                            }
                        }
                        return conv
                    })

                    return {
                        messages: newMessages,
                        conversations: updatedConversations
                    }
                })
            },

            // 发送消息（流式）
            sendMessage: async (content) => {
                const { activeConversationId, currentModel, addMessage } = get()

                if (!activeConversationId) {
                    get().createConversation()
                }

                // 添加用户消息
                addMessage({ content, role: 'user' })

                set({ isLoading: true, error: null })

                // 添加一个空的助手消息用于流式更新
                const assistantMessageId = `assistant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                addMessage({
                    id: assistantMessageId,
                    content: '',
                    role: 'assistant',
                    model: currentModel,
                    isStreaming: true
                })

                // 流式开始后立即取消加载状态
                set({ isLoading: false })

                try {
                    // 获取当前会话的所有消息作为上下文（排除刚添加的空助手消息）
                    const currentMessages = get().messages.filter(msg => msg.id !== assistantMessageId)

                    // 构建发送给AI的消息格式
                    const apiMessages = [
                        // 添加系统提示
                        {
                            role: 'system',
                            content: '你是一个友善、专业的AI助手。用户问的大多应该是关于生活的问题，比如油菜怎么做好吃，遇见蟑螂怎么办等等，你的回答应该是专业的，有依据的。你可以使用 Markdown 格式来增强回答的可读性，比如使用 **加粗** 来强调重点内容，使用列表来组织信息等。'
                        },
                        // 添加用户对话历史
                        ...currentMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ]

                    // 流式回调函数
                    const onStream = (delta, fullContent) => {
                        const messages = get().messages
                        const messageIndex = messages.findIndex(msg => msg.id === assistantMessageId)
                        if (messageIndex !== -1) {
                            const updatedMessages = [...messages]
                            updatedMessages[messageIndex] = {
                                ...updatedMessages[messageIndex],
                                content: fullContent
                            }
                            set({ messages: updatedMessages })
                        }
                    }

                    // 调用相应的AI API
                    let response
                    if (currentModel === 'qwen') {
                        response = await QwenChat(apiMessages, onStream)
                    } else {
                        response = await chat(apiMessages, undefined, undefined, undefined, onStream)
                    }

                    if (response.code === 0) {
                        // 标记流式完成
                        const messages = get().messages
                        const messageIndex = messages.findIndex(msg => msg.id === assistantMessageId)
                        if (messageIndex !== -1) {
                            const updatedMessages = [...messages]
                            updatedMessages[messageIndex] = {
                                ...updatedMessages[messageIndex],
                                isStreaming: false
                            }
                            set({ messages: updatedMessages })

                            // 保存更新后的消息到 localStorage
                            const { activeConversationId } = get()
                            if (activeConversationId) {
                                localStorage.setItem(`chat_messages_${activeConversationId}`, JSON.stringify(updatedMessages))
                            }
                        }
                    } else {
                        throw new Error(response.msg || '获取回复失败')
                    }
                } catch (error) {
                    console.error('发送消息失败:', error)
                    set({ error: error.message || '发送消息失败，请重试' })

                    // 更新助手消息为错误状态
                    const messages = get().messages
                    const messageIndex = messages.findIndex(msg => msg.id === assistantMessageId)
                    if (messageIndex !== -1) {
                        const updatedMessages = [...messages]
                        updatedMessages[messageIndex] = {
                            ...updatedMessages[messageIndex],
                            content: '抱歉，我现在无法回复您的消息，请稍后再试。',
                            isError: true,
                            isStreaming: false
                        }
                        set({ messages: updatedMessages })

                        // 保存更新后的消息到 localStorage
                        const { activeConversationId } = get()
                        if (activeConversationId) {
                            localStorage.setItem(`chat_messages_${activeConversationId}`, JSON.stringify(updatedMessages))
                        }
                    }
                } finally {
                    set({ isLoading: false })
                }
            },

            // 切换AI模型
            switchModel: (model) => {
                set({ currentModel: model })
            },

            // 清除错误
            clearError: () => {
                set({ error: null })
            },

            // 清空当前会话消息
            clearCurrentMessages: () => {
                const { activeConversationId } = get()
                if (activeConversationId) {
                    localStorage.removeItem(`chat_messages_${activeConversationId}`)
                    set({ messages: [] })
                }
            }
        }),
        {
            name: 'chat-store',
            // 只持久化会话列表，消息单独存储
            partialize: (state) => ({
                conversations: state.conversations,
                activeConversationId: state.activeConversationId,
                currentModel: state.currentModel
            })
        }
    )
)

export default useChatStore