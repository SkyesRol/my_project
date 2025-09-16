import axios from './config'


export const getImages = (page) => {
    return axios.get('/images', {
        params: {
            page
        }
    })
}

export const getTweets = (page = 1) => {
    return axios.get('/tweets', {
        params: {
            page
        }
    })
}