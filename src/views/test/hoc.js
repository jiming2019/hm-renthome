/*
  测试高阶组件
*/
import React from 'react'

// class AutoSizer extends React.Component {
//   render () {
//     let fn = this.props.children
//     let WrapHoc = fn({
//       width: 300,
//       height: 200
//     })
//     return WrapHoc
//   }
// }

// class Hoc extends React.Component {
//   render () {
//     // let { history } = this.props
//     // this.props.history.push()
//     // console.log(history)
//     // history && history.push()
//     // --------------------------------
//     // let fn = this.props.children
//     // fn({
//     //   width: 300,
//     //   height: 200
//     // })
//     return (
//       <div>
//         <div>Hoc: {this.props.width} {this.props.height}</div>
//         {/*<div>{this.props.children}</div>*/}
//       </div>
//     )
//   }
// }

// 定义一个高阶组件
// 参数接收一个组件
// 返回值返回另一个组件
// withHoc向参数组件注入一个history属性，它的值是一个对象，其中包含一个push方法
// 类似于之前React-router中的withRouter方法（其实它就是高阶组件）
// function withHoc (Component) {
//   return class extends React.Component {
//     state = {
//       obj: {
//         push () { console.log('push')}
//       }
//     }
//     render () {
//       return <Component history={this.state.obj}/>
//     }
//   }
// }

// const WrapHoc = withHoc(Hoc)

class TestHoc extends React.Component {
  render () {
    return (
      <div>
        <h1>测试高阶组件</h1>
        {/*<Hoc></Hoc>
        <WrapHoc></WrapHoc>*/}

        {/*<Hoc>
          {({width, height}) => {
            console.log('hello', width, height)
          }}
        </Hoc>*/}

        {/*<AutoSizer>
          {({width, height}) => (
            <Hoc width={width} height={height}/>
          )}
        </AutoSizer>*/}
      </div>
    )
  }
}

export default TestHoc