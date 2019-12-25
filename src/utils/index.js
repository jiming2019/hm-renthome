// 封装通用模块
import axios from  'axios'
export const IMG_BASE_URL = 'http://localhost:8080'
let instance = axios.create({
   baseURL:'http://localhost:8080'
})

// 响应拦截器
instance.interceptors.response.use(function (res) {
   return res.data
 })
 
 export default instance