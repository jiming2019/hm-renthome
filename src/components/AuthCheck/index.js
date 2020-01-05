/*
  封装通用的路由权限验证组件
*/
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { token } from '../../utils/token.js'
import { withRouter } from 'react-router-dom'

class AuthCheck extends React.Component {
  render () {
    let { path, component: Component } = this.props
    return (
      <Route path={path} render={() => {
        // 这里可以在渲染组件之前验证权限
        let t = token.getToken()
        let WrapComponent = withRouter(Component)
        // return t ? withRouter(Component) : <Redirect to='/login'/>
        return t ? <WrapComponent/> : <Redirect to='/login'/>
      }}/>
    )
  }
}

export default AuthCheck