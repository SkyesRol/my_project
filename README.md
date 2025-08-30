# react 旅游app
Readme.md 很重要 方便面试官

- 移动App
- 模仿 App
    - 喜欢的、国外的
    - 模仿一下，但是有点改变
- 绝大多数的考点
    - 都适用于任何App

## 技术栈
- React 全家桶
    - React 组件开发
    - 组件的封装
    - 第三方组件库
    - 受控和非受控组件
    - hooks编程 自定义hooks
    - React Router DOM
        - SPA
        - 路由守卫
        - 懒加载
    - Zustand
- mock 完成接口的模拟
- axios 请求拦截和代理
- JWT 鉴权登录
- module css
- vite 配置
- 性能优化
        防抖节流
        useCallback useMemo ......
- css 预处理器
    - flex
    - transition transform
- LLM
    - chat
    - 生图
    - 语言
    - coze 工作流 调用
    - 流式输出
- 移动端适配
    - rem
- 单例模式
- git 提交等编程风格
## 项目的架构
- components
- pages
- hooks
- store
- api 
- mock

## 开发前的准备
- 安装的包
    react-router-dom
    zustand
    axios
    react-vant(UI组件库) lib-flexible (解决移动端适配)
    - 开发时的依赖
        vite-plugin-mock
        jwt

- vite 配置
    - alias
    - mock
    - .env.local
    llm apiKey
    - user-scalable = no
    - css 预处理
        index.css reset
        box-sizing font-family:-apple-system
        App.css 全局通用样式
        module.css 模块化样式
    - 移动端适配 rem  vw vh
        不能用px，px是绝对单位，我们要用相对单位rem html
        不同设备上体验要一致
        不同尺寸手机 等比例缩放
        设计师设计稿 750px iphone 4 375pt * 2 =750
        小米 ？其他手机？
        css就一行代码，要实现让不同手机的布局等比例缩放，font-size要等比例
        layout
        flexible.js 阿里 再任何设备上
        **1rem = 屏幕宽度/10**
- lib-flexible
    阿里开源
    设置html fontSize = window
    innerWidth / 10
    css px 宽度 = 手机设备宽度 = 375
    1px = 2个发光源
    设计稿 750px ，这个设计稿应用到手机时只有375


- 设计稿查看一个盒子的大小？
    假定一个设计稿是750px，一个盒子是200px，则750px为10rem， 75px为1rem
    用 200 / 75 就是 2.6667rem
    - 1像素不差的还原设计稿
    - 设计稿中像素单位
    - 设计稿中px / 75 = rem

## 项目亮点
- 移动端适配
    - lib-flexible 1rem = 屏幕宽度的 1/10
    - 设计稿 尺寸是iphone 标准尺寸 750px
    - 前端的职责是还原设计稿
    - 频繁的换算单位
    - 如何自动转换单位？
        - pnpm i -D postcss-pxtorem
        postcss + postcss-pxtorem
        PostCSS是一个使用JS插件对于CSS进行处理的工具（CSS与编译器），
        可以通过插件实现自动转换单位，比如px转rem
        vite会自动读取postcss.config.js 将css文件编译 
        例如 px => rem

## git 提交规范
- 项目初始化
## 功能模块
- UI组件库
    - react-vant 第三方组件库 70%的组件已经有了，不用写
    - 选择一个适合业务的UI组件库 或者公司内部的组件库 
- Search
    - 防抖
    - api
        GoogleSuggest
    - localStorage
- 瀑布流
    - 现代小红书等主流App的内容浏览用户体验产品
        两列、图片高度不一致、有些落差感
        滚动加载更多，图片懒加载
    - 接口
        /api/images?page=${n} 支持翻页
        唯一id，使用 page + index
        随机图片，高度随机
    - images 怎么放到两列之中？ MVVM
    数据驱动界面（两列） 奇偶分两列
    - 加载更多 位于盒子底部的元素 通过使用 IntersectionObserver
        观察特定元素是否出现在视窗，性能更好，使用了观察者模式
        组件卸载时，直接使用disconnect 释放资源，防止内存泄露
    - key id 下拉刷新
    - 使用IntersectionObserver 再次图片懒加载 data-src

- toast 组件封装
    - 需要自定义，UI组件库不满足需求
    - UI props 
    - JS 显示出来 跨层级通信
        观察者
        pnpm i mitt
    - mitt eventBus 事件总线
        - 实例化 mitt()
        - on(自定义事件的名字，callback)
        - emit(自定义事件的名字，参数)
        组件通过监听一个自定义事件，实现基于事件的组件通信

- 配置路由以及懒加载
    - 懒加载
    - 路由守卫
    - Layout组件
        - 嵌套路由<Outlet /> 分组路由配置
        - 网页有几个模板 Layout
        - Route 不加path 对应的路由自动选择
            - tabbar 模板
            - blank 模板
        - tabbar
            - react-vant + @react-vant/icons
            - value + onChange 响应式
            - 点击链接分享，修改active的设置
- chatbot 模块
    - llm模块  chat 封装
    - 迭代 chat ， 支持任意模型
## 项目亮点和难点
- 前端智能
    - chat函数
    - 对各家模型比较感兴趣，升级为各种模型
        性能，能力，性价比
        随意切换大模型
- 原子css
    - App.css 里面添加通用样式
    - 各自模块里module.css 不影响别的组件
    - lib-flexible 移动端适配
    - postcss pxtorem 插件 快速还原设计稿
    - 原子类的css，
        一个元素按功能逻辑拆分成多个类，和原子一样
        元素的样式就可以由这些原子类组合而成
        样式复用的更好
    - 用户体验优化
        - 搜索建议，防抖+useMemo 性能优化
        - 组件粒度划分
            React.memo + useCallback
        - 懒加载
        - 热门推荐 + 相关商品（产品）
        - SPA
        - 骨架屏 不用让用户等待了
        - 文件上传的preview html5 FileReader
    - 智能生成图片
        - 产品
        曲棍球社群的宠物运动员 智能出图
        拥有社交属性
        - 商业价值
        技术服务
        coze 工作流 智能编排AI 流程 编程的一种
        - api调用

    - 设计工作流
        - 创建工作流 ani_pic
            上传宠物图片，生成宠物曲球棍运动员照片
        - 代码节点
            参数校验和逻辑功能，返回运行的结果
        - 图片生成流程
            - 图片理解插件  计算机视觉
            - 大模型 特征提取
            prompt
        - workflow_id  7543570546992332846
        - 个人令牌 token 
        - coze 图片要先上传到coze的云服务器中，才能读取图片
            uploadUrl + token + new FormData
            append(file) 将file加入请求体
            拿到file_id
        -   workflow workflow_id + token
            工作流需要的参数
            
## 项目遇到过什么问题，怎么解决的
- chat messages 遇到了一些message的覆盖问题
    - 闭包陷阱  两次setMessages
- 升级瀑布流？
    - 骨架屏
    - 奇偶images 两列分配可能有时候会像天残脚一样，不好看，随机嘛
        用两个响应式数组，判断哪一列高度小，就将新得到的img加入哪个数组
    - intersectionObserver 用的两次，重复了，dry 原则 封装？
        hooks




## es6特性使用
- arr.findIndex
- str.startsWith
- promise
- 瀑布流随机数据生成
    - Array.from(length,callback(什么规则来填充数组))

- 项目迭代
    - 功能由浅入深
    - chatbot deepseek chat
    - deepseek-r1 推理模型
    - 流式输出
    - 上下文 LRU
    - coze 工作流接口调用

## 通用组件开发
- Loading
    - 居中方案
        - position fixed
        - left 0
        - right 0
        - top 0
        - bottom 0
        - margin auto
    - animation
    - React.memo 无状态组件，不重新渲染
## mock
- pnpm i mockjs