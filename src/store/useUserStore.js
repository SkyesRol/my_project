import {
    create
} from 'zustand'
import { doLogin, verifyToken } from '../api/user';
export const useUserStore = create(set => ({
    user: null, // 用户信息
    isLogin: false, // 是否登录
    login: async ({ username = '', password = '' }) => {
        try {
            const res = await doLogin({
                username,
                password
            });
            console.log(res);
            
            // 检查登录是否成功
            if (res.code === 1) {
                throw new Error(res.msg || '登录失败');
            }
            
            const { token, data: user } = res; // 修复：直接从res中解构，而不是res.data
            console.log(token, user, '////////');
            
            if (!token) {
                throw new Error('登录失败：未获取到token');
            }
            
            localStorage.setItem('token', token);
            
            set({
                user,
                isLogin: true
            });
            
            return res; // 返回登录结果
        } catch (error) {
            console.error('登录失败:', error);
            throw error; // 抛出错误，让调用者处理
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            isLogin: false
        })
    },
    
    // 验证token是否有效
    validateToken: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ isLogin: false, user: null });
                return false;
            }
            
            const res = await verifyToken();
            if (res.code === 0 && res.data) {
                set({ isLogin: true, user: res.data });
                return true;
            } else {
                localStorage.removeItem('token');
                set({ isLogin: false, user: null });
                return false;
            }
        } catch (error) {
            console.error('Token验证失败:', error);
            localStorage.removeItem('token');
            set({ isLogin: false, user: null });
            return false;
        }
    }

}))