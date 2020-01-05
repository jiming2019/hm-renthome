/*
  高阶组件补充分析
  withRouter
  长列表组件嵌套用法
  withFormik
*/
import React from 'react'

class Hoc extends React.Component {
  render () {
    let { msg, showMsg } = this.props
    return (
      <div>
        <div>
          高阶组件: {msg}
          <button onClick={() => {
            showMsg(msg)
          }}>点击</button>
        </div>
      </div>
    )
  }
}

function withFormic (obj) {
  // 高阶组件：本质就是一个函数，参数接收一个组件，返回另一个组件，但是一般会在返回的组件中注入一些新的属性
  return (Component) => {
    return class extends React.Component {
      render () {
        return <Component {...obj}/>
      }
    }
  }
}

// let WrapCom = withFormic({
// })(Hoc)
// export default WrapCom
export default withFormic({
  msg: 'nihao',
  showMsg: (msg) => {
    console.log(msg)
  }
})(Hoc)

