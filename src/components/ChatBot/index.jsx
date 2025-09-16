import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Loading, Popup } from 'react-vant'
import { Certificate, ChatO, UserO, Setting } from '@react-vant/icons'
import useChatStore from '@/store/useChatStore'
import { parseMarkdown, hasMarkdown } from '@/utils/markdown'
import styles from './chatbot.module.css'
import { useNavigate } from 'react-router-dom'

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('')
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {
    messages,
    isLoading,
    error,
    currentModel,
    sendMessage,
    switchModel,
    clearError,
    clearCurrentMessages
  } = useChatStore()
  const navigate = useNavigate()
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const redirectToCoze = () => {
    navigate('/coze')
  }
  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const message = inputValue.trim()
    setInputValue('')

    try {
      await sendMessage(message)
    } catch (error) {
      console.error('发送消息错误:', error)
      console.log('发送失败，请重试')
    }
  }

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 切换模型
  const handleModelSwitch = (model) => {
    try {
      switchModel(model)
      setShowModelSelector(false)
      console.log(`已切换到 ${model === 'qwen' ? 'Qwen' : 'DeepSeek'} 模型`)
    } catch (error) {
      console.error('切换模型错误:', error)
      console.log('切换模型失败')
    }
  }

  // 清空对话
  const handleClearChat = () => {
    clearCurrentMessages()
    console.log('对话已清空')
  }

  // 重试发送
  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content)
      }
    }
  }

  return (
    <div className={styles.chatContainer}>
      {/* 头部区域 - header */}
      <header className={styles.chatHeader}>
        <div className={styles.title}>
          <ChatO className={styles.robotIcon} />
          智能助手
        </div>
        <div className={styles.actions}>
          <Button
            size='small'
            type='primary'
            onClick={redirectToCoze}
          >
            Coze
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<Setting />}
            onClick={() => setShowModelSelector(true)}
          >
            {currentModel === 'qwen' ? 'Qwen' : 'DeepSeek'}
          </Button>
          <Button
            size="small"
            onClick={handleClearChat}
          >
            清空
          </Button>
        </div>
      </header>

      {/* 主要内容区域 - main */}
      <main className={styles.chatMain}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <ChatO className={styles.emptyIcon} />
              <p>你好！我是你的智能助手，有什么可以帮助你的吗？</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageItem} ${styles[message.role]}`}
              >
                <div className={styles.avatar}>
                  {message.role === 'user' ? (
                    <UserO className={styles.userIcon} />
                  ) : (
                    <ChatO className={styles.botIcon} />
                  )}
                </div>
                <div className={styles.messageContent}>
                  <div className={`${styles.messageBubble} ${message.isError ? styles.errorMessage : ''} ${message.isStreaming ? styles.streaming : ''}`}>
                    {hasMarkdown(message.content) ? (
                      <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
                    ) : (
                      message.content
                    )}
                    {message.isStreaming && <span className={styles.cursor}>|</span>}
                  </div>
                  <div className={styles.messageTime}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {message.model && (
                      <span className={styles.modelTag}>
                        {message.model === 'qwen' ? 'Qwen' : 'DeepSeek'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* 加载状态 */}
          {isLoading && (
            <div className={`${styles.messageItem} ${styles.assistant}`}>
              <div className={styles.avatar}>
                <ChatO className={styles.botIcon} />
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <Loading className={styles.loadingIcon} />
                  正在思考中...
                </div>
              </div>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
              <Button
                size="small"
                type="primary"
                onClick={handleRetry}
              >
                重试
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 底部输入区域 - footer */}
      <footer className={styles.chatFooter}>
        <div className={styles.inputWrapper}>
          <Input.TextArea
            ref={inputRef}
            value={inputValue}
            onChange={setInputValue}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className={styles.messageInput}
            style={{ lineHeight: '24px' }} /* 添加行高确保文本垂直居中 */
          />
          <Button
            type="primary"
            icon={<Certificate />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={styles.sendButton}
          >

          </Button>
        </div>
      </footer>

      {/* 模型选择弹窗 */}
      <Popup
        visible={showModelSelector}
        onClose={() => setShowModelSelector(false)}
        position="bottom"
        round
      >
        <div className={styles.modelSelector}>
          <h3>选择AI模型</h3>
          <div className={styles.modelOptions}>
            <div
              className={`${styles.modelOption} ${currentModel === 'deepseek' ? styles.active : ''}`}
              onClick={() => handleModelSwitch('deepseek')}
            >
              <div className={styles.modelInfo}>
                <h4>DeepSeek</h4>
                <p>强大的通用AI模型</p>
              </div>
              {currentModel === 'deepseek' && <div className={styles.checkmark}>✓</div>}
            </div>
            <div
              className={`${styles.modelOption} ${currentModel === 'qwen' ? styles.active : ''}`}
              onClick={() => handleModelSwitch('qwen')}
            >
              <div className={styles.modelInfo}>
                <h4>Qwen</h4>
                <p>擅长长文本理解的AI模型</p>
              </div>
              {currentModel === 'qwen' && <div className={styles.checkmark}>✓</div>}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default ChatBot