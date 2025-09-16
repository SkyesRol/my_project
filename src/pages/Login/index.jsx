import { useRef, useState } from 'react'
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { showMessage } from '@/components/Toast/ToastController';

// 非受控组件
const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { login } = useUserStore();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        
        if (!username || !password) {
            showMessage('请输入用户名和密码', 'warning');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await login({
                username,
                password
            });
            
            // 登录成功
            showMessage('登录成功，即将跳转到首页', 'success');
            
            // 延迟跳转，确保用户看到提示
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            // 登录失败
            showMessage('登录失败：' + (error.message || '用户名或密码错误'), 'error');
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginForm}>
                <h2>登录</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">用户名</label>
                        <input
                            ref={usernameRef}
                            type="text"
                            id="username"
                            placeholder="请输入用户名"
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">密码</label>
                        <input
                            ref={passwordRef}
                            type="password"
                            id="password"
                            placeholder="请输入密码"
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button 
                            type='submit' 
                            className={styles.loginButton}
                            disabled={isLoading}
                        >
                            {isLoading ? '登录中...' : '登录'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;