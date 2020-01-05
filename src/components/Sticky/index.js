/*
  封装一个通用的吸顶组件
*/
import React from 'react'
import styles from './index.module.css'
import PropTypes from 'prop-types'

class Sticky extends React.Component {

  state = {
    // 定制吸顶组件的高度
    defaultHeight: this.props.height || 40
  }

  placeholderRef = React.createRef()

  contentRef = React.createRef()

  scrollHandle = () => {
    // 监听页面滚动：获取要操作的DOM元素
    let placeholder = this.placeholderRef.current
    let content = this.contentRef.current

    // 判断吸顶组件是否超出可视区
    let { top } = placeholder.getBoundingClientRect()
    if (top <= 0) {
      // 超出上边界：控制吸顶组件进行定位，并且设占位符高度为吸顶组件的高度
      content.className = styles.toFix
      placeholder.style.height = this.state.defaultHeight + 'px'
    } else {
      // 没有超出上边界：去掉吸顶组件的定位，并且将占位符高度重置为0
      content.className = ''
      placeholder.style.height = 0
    }
  }

  componentDidMount () {
    // 监听页面的滚动行为
    window.addEventListener('scroll', this.scrollHandle)
  }

  componentWillUnmount () {
    // 组件销毁时，注销滚动事件
    window.removeEventListener('scroll', this.scrollHandle)
  }

  render () {
    return (
      <React.Fragment>
        {/*空的DIV占位符，当组件进行定位时，防止文档流坍塌*/}
        <div ref={this.placeholderRef}></div>
        {/*实现吸顶的组件*/}
        <div ref={this.contentRef}>{this.props.children}</div>
      </React.Fragment>
    )
  }
}

Sticky.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number
}

export default Sticky
