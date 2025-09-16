// search模块
import axios from './config'


export const getSuggestList = async (keyword) => {
    const res = await axios.get(`/search?keyword=${keyword}`, {

    })
    return res;
}

export const getHotList = async (data) => {
    return axios.get('./hotList')
}