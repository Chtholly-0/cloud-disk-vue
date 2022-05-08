import axios from 'axios'

axios.defaults.timeout = 30000 //超时时间为5s
axios.defaults.withCredentials = true //允许跨域

// 响应头
axios.defaults.headers.post['Content-Type'] = 'application/json'
//基础url
axios.defaults.baseURL = '/api';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        let token = window.localStorage.getItem("Authorization");
        token && (config.headers.Authorization = token)
        return config
    },
    error =>  {
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error)
})

export default axios