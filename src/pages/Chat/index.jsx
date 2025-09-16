import React, { useEffect, useState } from 'react'
import { Button, Popup, Dialog } from 'react-vant'
import { Plus, Delete, Chat as ChatIcon } from '@react-vant/icons'
import ChatBot from '@/components/ChatBot'
import useTitle from '@/hooks/useTitle'
import useChatStore from '@/store/useChatStore'
import styles from './chat.module.css'

const Chat = () => {
  useTitle('Chatbot')
  const [showSidebar, setShowSidebar] = useState(false)

  const {
    conversations,
    activeConversationId,
    createConversation,
    switchConversation,
    deleteConversation
  } = useChatStore()

  // 初始化：如果没有活跃会话，创建一个新会话
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation()
    } else if (!activeConversationId && conversations.length > 0) {
      switchConversation(conversations[0].id)
    }
  }, [conversations, activeConversationId, createConversation, switchConversation])

  // 创建新会话
  const handleCreateConversation = () => {
    createConversation()
    setShowSidebar(false)
  }

  // 切换会话
  const handleSwitchConversation = (conversationId) => {
    switchConversation(conversationId)
    setShowSidebar(false)
  }

  // 删除会话
  const handleDeleteConversation = (conversationId, conversationTitle) => {
    console.log('开始删除对话:', conversationId, conversationTitle)

    // 使用原生 confirm 作为备选方案
    if (window.confirm(`确定要删除对话「${conversationTitle}」吗？`)) {
      console.log('用户确认删除')
      deleteConversation(conversationId)
      console.log('删除操作完成')
    } else {
      console.log('用户取消删除')
    }
  }

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) { // 1分钟内
      return '刚刚'
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) { // 24小时内
      return `${Math.floor(diff / 3600000)}小时前`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={styles.chatPage}>
      {/* 主聊天区域 */}
      <div className={styles.chatMain}>
        {/* 顶部导航 */}
        <div className={styles.chatHeader}>
          <Button
            size="small"
            onClick={() => setShowSidebar(true)}
            className={styles.sidebarToggle}
          >
            对话列表
          </Button>
          <div className={styles.currentChat}>
            {activeConversationId && (
              <span>
                {conversations.find(c => c.id === activeConversationId)?.title || '新对话'}
              </span>
            )}
          </div>
          <Button
            size="small"
            type="primary"
            icon={<Plus />}
            onClick={handleCreateConversation}
          >
            新对话
          </Button>
        </div>

        {/* 聊天组件 */}
        {activeConversationId ? (
          <ChatBot key={activeConversationId} />
        ) : (
          <div className={styles.noChat}>
            <ChatIcon className={styles.noChatIcon} />
            <p>选择一个对话开始聊天</p>
            <Button type="primary" onClick={handleCreateConversation}>
              开始新对话
            </Button>
          </div>
        )}
      </div>

      {/* 侧边栏 - 对话列表 */}
      <Popup
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        position="left"
        style={{ width: '80%', maxWidth: '320px', height: '100%' }}
      >
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>对话历史</h3>
            <Button
              size="small"
              type="primary"
              icon={<Plus />}
              onClick={handleCreateConversation}
            >
              新对话
            </Button>
          </div>

          <div className={styles.conversationList}>
            {conversations.length === 0 ? (
              <div className={styles.emptyConversations}>
                <p>暂无对话记录</p>
                <Button type="primary" onClick={handleCreateConversation}>
                  创建第一个对话
                </Button>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className={styles.conversationWrapper}>
                  <div
                    className={`${styles.conversationItem} ${conversation.id === activeConversationId ? styles.active : ''
                      }`}
                    onClick={() => handleSwitchConversation(conversation.id)}
                  >
                    <div className={styles.conversationInfo}>
                      <div className={styles.conversationTitle}>
                        {conversation.title}
                      </div>
                      <div className={styles.conversationMeta}>
                        <span className={styles.messageCount}>
                          {conversation.messageCount} 条消息
                        </span>
                        <span className={styles.conversationTime}>
                          {formatTime(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="small"
                      type="danger"
                      icon={<Delete />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConversation(conversation.id, conversation.title)
                      }}
                      style={{ marginLeft: '8px', zIndex: 10, position: 'relative' }}
                    />
                    {conversation.id === activeConversationId && (
                      <div className={styles.activeIndicator} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default Chat