/*
  封装通用的API
*/
import axios from 'axios'
import { token } from './token.js'
// export const IMG_BASE_URL = 'http://localhost:8080'
export const IMG_BASE_URL = process.env.REACT_APP_BASEURL
let instance = axios.create({
  // baseURL: 'http://localhost:8080/'
  baseURL: IMG_BASE_URL
})

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // config参数表示请求的配置信息
  if (config.url !== '/user/login') {
    config.headers.authorization = token.getToken()
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(function (res) {
  return res.data
})

// 获取当前城市通用方法
export const getCurrentCity = () => {
  return new Promise(function (resolve) {
    // 完成定位信息获取
    // 从本地缓存获取当前城市的数据
    let city = localStorage.getItem('currentCity')
    if (city) {
      // 本地缓存包含数据
      let obj = JSON.parse(city)
      resolve(obj)
    } else {
      // 通过地理定位获取当前城市
      const position = new window.BMap.LocalCity()
      position.get( async (ret) => {
        // 根据地理定位得到的城市名称获取城市的详细信息
        let res = await instance.get('/area/info', {
          params: {
            name: ret.name
          }
        })
        // 缓存当前城市数据
        localStorage.setItem('currentCity', JSON.stringify(res.body))
        resolve(res.body)
      })
    }
  })
}

export default instance