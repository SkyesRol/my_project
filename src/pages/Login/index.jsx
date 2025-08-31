import { useRef } from 'react'
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

// 非受控组件
const Login = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { login } = useUserStore();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        if (!username || !password) {
            alert('请输入用户名或密码');
            return;
        }
        login({
            username,
            password
        });
        setTimeout(() => {
            navigate('/')
        }, 1000)
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
                        <button type='submit' className={styles.loginButton}>登录</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;