import './App.css'
import {
  Suspense,
  lazy
} from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { ConfigProvider } from 'react-vant'
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading'
import Toast from '@/components/Toast'
import ProtectedRoute from '@/components/ProtectedRoute'
const Home = lazy(() => import('@/pages/Home'))
const Search = lazy(() => import('@/pages/Search'))
const Account = lazy(() => import('@/pages/Account'))
const Collection = lazy(() => import('@/pages/Collection'))
const Login = lazy(() => import('@/pages/Login'))
const Detail = lazy(() => import('@/pages/Detail'))
const Coze = lazy(() => import('@/pages/Coze'))
const Chat = lazy(() => import('@/pages/Chat'))

function App() {
  // 自定义 Tabbar 主题变量
  const themeVars = {
    // Tabbar 背景色
    'tabbarBackgroundColor': '#000000',
    // Tabbar 项目激活状态颜色（白色）
    'tabbarItemActiveColor': '#ffffff',
    // Tabbar 项目非激活状态颜色（灰色）
    'tabbarItemTextColor': '#666666',
    // Tabbar 项目激活状态背景色（黑色）
    'tabbarItemActiveBackgroundColor': '#000000',
    // 字体加粗
    'fontWeightBold': '600',
    // 添加过渡动画
    'tabbarItemTransitionDuration': '0.3s',
    'tabbarItemTransitionTimingFunction': 'ease-in-out'
  }

  return (
    <ConfigProvider themeVars={themeVars}>
      <Suspense fallback={<Loading />}>
        <Toast />
        {/* 带有tabbar的Layout */}
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={
              <Navigate to='/home' />
            } />
            <Route path='/home' element={<Home />} />
            <Route path='/collection' element={<Collection />} />

            <Route path='/account' element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
        {/* 空的Layout */}
        <Routes >
          <Route element={<BlankLayout />}>
            <Route path='/search' element={<Search />} />
            <Route path='/detail/:id' element={<Detail />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/chat' element={<Chat />} />
          </Route>
          <Route path='/coze' element={<Coze />} />

        </Routes>
      </Suspense>
    </ConfigProvider>
  )
}

export default App
