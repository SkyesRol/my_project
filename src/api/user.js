import axios from './config'

export const doLogin = (data) => {
    return axios.post('/login', data);
}