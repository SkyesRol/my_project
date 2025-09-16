import { marked } from 'marked'

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 支持 GitHub Flavored Markdown
  sanitize: false, // 不过滤 HTML（谨慎使用）
  smartLists: true,
  smartypants: true
})

// 解析 Markdown 文本为 HTML
export const parseMarkdown = (text) => {
  if (!text) return ''

  try {
    return marked(text)
  } catch (error) {
    console.error('Markdown 解析错误:', error)
    return text // 如果解析失败，返回原文本
  }
}



// 检查文本是否包含 Markdown 格式
export const hasMarkdown = (text) => {
  if (!text) return false

  // 检查是否包含常见的 Markdown 语法
  const markdownPatterns = [
    /\*\*.*?\*\*/, // 加粗 **text**
    /__.*?__/, // 加粗 __text__
    /\*.*?\*/, // 斜体 *text*
    /_.*?_/, // 斜体 _text_
    /`.*?`/, // 代码 `code`
    /^#{1,6}\s/, // 标题 # ## ###
    /^\* /, // 列表 * item
    /^\d+\. /, // 有序列表 1. item
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}