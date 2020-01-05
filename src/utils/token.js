/*
  封装token通用操作方法
*/
const TOKEN_KEY = 'mytoken'
export const token = {
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY)
  },

  setToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token)
  },

  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

