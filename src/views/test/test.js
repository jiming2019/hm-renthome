/*
  测试反向代理
*/
import React from 'react'
import axios from 'axios'

class TestProxy extends React.Component {
  state = {
    msg: ''
  }
  handle = () => {
    axios.get('/api/data')
      .then(res => {
        this.setState({
          msg: res.data
        })
      })
  }
  render () {
    return (
      <div>
        <div>{this.state.msg}</div>
        <button onClick={this.handle}>点击</button>
      </div>
    )
  }
}

export default TestProxy