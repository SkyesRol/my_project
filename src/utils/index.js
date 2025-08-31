// utils 工具函数  纯js如 防抖节流放在utils，与响应式业务相关放在hooks

export const debounce = (fn, delay) => {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay)
    }
}













