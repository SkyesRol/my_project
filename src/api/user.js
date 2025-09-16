import axios from './config'

export const doLogin = (data) => {
    return axios.post('/login', data);
}

export const verifyToken = () => {
    return axios.get('/user');
}