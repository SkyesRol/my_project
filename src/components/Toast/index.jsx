import { useRef, useState, useEffect } from 'react';
import Styles from './Toast.module.css';
import { toastEvents } from './ToastController';

const Toast = () => {
    const [visible, setIsVisible] = useState(false);
    const [data, setData] = useState({
        user: 0,
        bell: 0,
        mail: 0
    })
    useEffect(() => {
        // toastEvents 是 mitt 的实例
        // 自定义事件 show 是事件的名字
        // on 监听一个事件
        // 订阅者 订阅了show的事件 
        toastEvents.on('show', (info) => {
            setData(info);
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false)
            }, 3000)
        })
        return () => {
            toastEvents.off('show');
        }
    }, [])
    // 等着通信的道来
    // 事件机制
    if (!visible) return null;
    return (

        <div className={Styles.toastWrapper}>
            <div className={Styles.toastItem}>👤 {data.user}</div>
            <div className={Styles.toastItem}>🔔 {data.bell}</div>
            <div className={Styles.toastItem}>✉️ {data.mail}</div>
            <div className={Styles.toastArrow}></div>
        </div>
    )


}

export default Toast;