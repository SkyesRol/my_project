# React 社交媒体应用

一个基于 React + Vite 构建的现代化社交媒体应用，集成了推文浏览、搜索、收藏、聊天和 AI 图像生成等功能。

## 🚀 项目特色

- **现代化技术栈**：React 18 + Vite + React Router + Zustand
- **移动端优先**：响应式设计，完美适配手机和桌面端
- **丰富功能**：推文浏览、搜索、收藏、实时聊天、AI 图像生成
- **优雅 UI**：基于 React Vant 组件库，提供流畅的用户体验
- **状态管理**：使用 Zustand 进行轻量级状态管理
- **路由保护**：完整的用户认证和路由保护机制

## 📱 主要功能

### 🏠 首页 (Home)
- 推文流浏览
- 下拉刷新和上拉加载更多

- 实时数据更新

### 🔍 搜索 (Search)
- 全文搜索功能
- 搜索历史记录
- 智能搜索建议

### ❤️ 收藏 (Collection/Tiktok)
- 个人收藏管理
- 收藏内容分类
- 快速访问收藏项
- - 瀑布流布局展示

### 💬 聊天 (Chat)
- 实时聊天功能
- 消息历史记录
- 用户在线状态

### 🎨 AI 图像生成 (Coze)
- 集成 Coze AI 工作流
- 图像上传和预览
- AI 音频生成
- 实时状态反馈

### 👤 个人中心 (Account)
- 用户信息管理
- 个人设置
- 登录状态管理

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化 React 框架
- **Vite** - 快速构建工具
- **React Router DOM** - 客户端路由

### UI 组件库
- **React Vant** - 移动端 UI 组件库
- **@react-vant/icons** - 图标库

### 状态管理
- **Zustand** - 轻量级状态管理

### 网络请求
- **Axios** - HTTP 客户端

### 工具库
- **marked** - Markdown 解析
- **jsonwebtoken** - JWT 处理
- **mitt** - 事件总线
- **lib-flexible** - 移动端适配

### 开发工具
- **ESLint** - 代码规范检查
- **PostCSS** - CSS 处理
- **postcss-pxtorem** - px 转 rem
- **vite-plugin-mock** - API Mock

## 📦 安装和运行

### 环境要求
- Node.js >= 16.0.0
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发环境运行
```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产环境构建
```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

### 代码检查
```bash
# 运行 ESLint
pnpm lint
```

## 🏗️ 项目结构

```
src/
├── api/                 # API 接口
│   ├── config.js       # API 配置
│   ├── home.js         # 首页接口
│   ├── search.js       # 搜索接口
│   ├── detail.js       # 详情接口
│   └── user.js         # 用户接口
├── components/          # 公共组件
│   ├── MainLayout/     # 主布局组件
│   ├── BlankLayout/    # 空白布局组件
│   ├── NavBar/         # 导航栏
│   ├── TweetCard/      # 推文卡片
│   ├── ImageCard/      # 图片卡片
│   ├── SearchBox/      # 搜索框
│   ├── ChatBot/        # 聊天机器人
│   ├── Loading/        # 加载组件
│   ├── Toast/          # 提示组件
│   ├── Waterfall/      # 瀑布流组件
│   └── ProtectedRoute/ # 路由保护
├── pages/              # 页面组件
│   ├── Home/           # 首页
│   ├── Search/         # 搜索页
│   ├── Collection/     # 收藏页
│   ├── Chat/           # 聊天页
│   ├── Coze/           # AI 图像生成页
│   ├── Account/        # 个人中心
│   ├── Login/          # 登录页
│   └── Detail/         # 详情页
├── store/              # 状态管理
│   ├── useTweetStore.js    # 推文状态
│   ├── useSearchStore.js   # 搜索状态
│   ├── useImageStore.js    # 图片状态
│   ├── useChatStore.js     # 聊天状态
│   ├── useDetailStore.js   # 详情状态
│   └── useUserStore.js     # 用户状态
├── hooks/              # 自定义 Hooks
│   └── useTitle.js     # 页面标题 Hook
├── utils/              # 工具函数
│   ├── index.js        # 通用工具
│   └── markdown.js     # Markdown 工具
├── llm/                # AI 相关
│   └── index.js        # LLM 配置
└── assets/             # 静态资源
    └── react.svg       # React 图标
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件配置环境变量：
```env
# Coze AI 配置
VITE_BOT_ID=your_bot_id
VITE_COZE_API_TOKEN=your_api_token

# API 基础地址
VITE_API_BASE_URL=http://localhost:3000
```

### 移动端适配
项目使用 `lib-flexible` 和 `postcss-pxtorem` 实现移动端适配：
- 设计稿基准：750px
- 根字体大小：动态计算
- px 自动转换为 rem

## 🎯 核心特性

### 响应式设计
- 移动端优先的设计理念
- 断点适配：手机、平板、桌面
- 触摸友好的交互设计

### 性能优化
- 路由懒加载
- 图片懒加载
- 虚拟滚动
- 防抖和节流

### 用户体验
- 流畅的页面切换动画
- 下拉刷新和上拉加载
- 加载状态反馈
- 错误边界处理

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

- **开发者** - 全栈开发工程师
- **邮箱** - your.email@example.com
- **GitHub** - [@yourusername](https://github.com/yourusername)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！