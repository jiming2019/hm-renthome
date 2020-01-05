import React from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from 'antd-mobile'
import API from '../../utils/index.js'
import { token } from '../../utils/token.js'
import { Link } from 'react-router-dom'
import { withFormik } from 'formik'
import * as yup from 'yup'

import styles from './index.module.css'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

// class Login extends Component {
//   // state = {
//   //   username: '',
//   //   password: ''
//   // }

//   // handleItem = (e) => {
//   //   this.setState({
//   //     [e.target.name]: e.target.value
//   //   })
//   // }

//   // handleSubmit = async (e) => {
//   //   // 阻止表单的默认提交行为
//   //   e.preventDefault()
//   //   let { username, password } = this.state
//   //   // 如果需要做手工表单验证，可以在这里处理
//   //   let res = await API.post('/user/login', {
//   //     username: username,
//   //     password: password
//   //   })
//   //   if (res.status === 200) {
//   //     // 登录成功，缓存token，跳转到主页面
//   //     sessionStorage.setItem('mytoken', res.body.token)
//   //     this.props.history.push('/home')
//   //   } else {
//   //     Toast.info(res.description, 1)
//   //   }
//   // }

//   render() {
//     // let { username, password } = this.state
//     let { 
//       // 表单绑定的数据
//       values,
//       // 提交事件处理函数
//       handleSubmit,
//       // 监听表单值的变化
//       handleChange
//     } = this.props
//     return (
//       <div className={styles.root}>
//         {/* 顶部导航 */}
//         <NavBar className={styles.navHeader} mode="dark">
//           账号登录
//         </NavBar>
//         <WhiteSpace size="xl" />

//         {/* 登录表单 */}
//         <WingBlank>
//           <form onSubmit={handleSubmit}>
//             <div className={styles.formItem}>
//               <input
//                 className={styles.input}
//                 name="username"
//                 value={values.username}
//                 onChange={handleChange}
//                 placeholder="请输入账号"
//               />
//             </div>
//             {/* 长度为5到8位，只能出现数字、字母、下划线 */}
//             {/* <div className={styles.error}>账号为必填项</div> */}
//             <div className={styles.formItem}>
//               <input
//                 className={styles.input}
//                 name="password"
//                 value={values.password}
//                 onChange={handleChange}
//                 type="password"
//                 placeholder="请输入密码"
//               />
//             </div>
//             {/* 长度为5到12位，只能出现数字、字母、下划线 */}
//             {/* <div className={styles.error}>账号为必填项</div> */}
//             <div className={styles.formSubmit}>
//               <button className={styles.submit} type="submit">
//                 登 录
//               </button>
//             </div>
//           </form>
//           <Flex className={styles.backHome}>
//             <Flex.Item>
//               <Link to="/registe">还没有账号，去注册~</Link>
//             </Flex.Item>
//           </Flex>
//         </WingBlank>
//       </div>
//     )
//   }
// }

function Login(props) {
  let { 
    // 表单绑定的数据
    values,
    // 提交事件处理函数
    handleSubmit,
    // 监听表单值的变化
    handleChange,
    // 错误提示信息
    errors,
    // 用户是否已经操作过表单输入域
    touched,
    // 触发验证的条件
    handleBlur
  } = props
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavBar className={styles.navHeader} mode="dark">
        账号登录
      </NavBar>
      <WhiteSpace size="xl" />
      {/* 登录表单 */}
      <WingBlank>
        <form onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <input
              className={styles.input}
              name="username"
              value={values.username}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="请输入账号"
            />
          </div>
          {/* 长度为5到8位，只能出现数字、字母、下划线 */}
          { errors.username&&touched.username&&<div className={styles.error}>{errors.username}</div> }
          <div className={styles.formItem}>
            <input
              className={styles.input}
              name="password"
              value={values.password}
              onChange={handleChange}
              type="password"
              placeholder="请输入密码"
            />
          </div>
          {/* 长度为5到12位，只能出现数字、字母、下划线 */}
          { errors.password&&touched.password&&<div className={styles.error}>{errors.password}</div> }
          <div className={styles.formSubmit}>
            <button className={styles.submit} type="submit">
              登 录
            </button>
          </div>
        </form>
        <Flex className={styles.backHome}>
          <Flex.Item>
            <Link to="/registe">还没有账号，去注册~</Link>
          </Flex.Item>
        </Flex>
      </WingBlank>
    </div>
  )
}

// export default Login
export default withFormik({
  // 这里用于配置表单验证规则
  mapPropsToValues: () => ({username: '', password: ''}),
  // 提交事件处理函数
  handleSubmit: async (values, login) => {
    // 参数一表示表单输入的所有数据
    // 参数二表示Login组件的实例对象（其实就是之前的this）
    let res = await API.post('/user/login', {
      username: values.username,
      password: values.password
    })
    if (res.status === 200) {
      // 登录成功，缓存token，跳转到主页面
      // sessionStorage.setItem('mytoken', res.body.token)
      token.setToken(res.body.token)
      login.props.history.push('/home')
    } else {
      Toast.info(res.description, 1)
    }
  },
  // 实现表单验证
  // validate: (values) => {
  //   let errors = {}
    
  //   if (!values.username) {
  //     // 用户名没有输入
  //     errors.username = '用户名不能为空'
  //   } else if (!REG_UNAME.test(values.username)) {
  //     errors.username = '用户名应该为5-8位的字符串'
  //   }

  //   if (!values.password) {
  //     // 用户名没有输入
  //     errors.password = '密码不能为空'
  //   } else if (!REG_PWD.test(values.password)) {
  //     errors.password = '密码应该为5-12位的字符串'
  //   }

  //   return errors
  // }
  validationSchema: yup.object().shape({
    // 这里用于实现规则验证
    username: yup.string().required('用户名不能为空').matches(REG_UNAME, '用户名应该为5-8位的字符串'),
    password: yup.string().required('密码不能为空').matches(REG_PWD, '密码应该为5-12位的字符串')
  })
})(Login)
