import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_NEXT_PUBLIC_API_URL

axios.interceptors.request.use((config) => {
    // token
    return config;
})
// 响应拦截
axios.interceptors.response.use((data) => {
    return data.data
})

export default axios;