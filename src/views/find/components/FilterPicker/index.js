import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterPicker extends Component {

  // 状态的初始化仅仅发生在组件第一次渲染时，当数据更新时，不会再次初始化
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
  }

  onChange = (value) => {
    this.setState({
      value
    })
  }

  componentDidUpdate (prevProps, prevState) {
    // 该生命周期函数触发条件：组件的相关数据（props和state）发生变化
    // 如果父组件defaultValue的props值发生变化时，手动进行更新
    // 必须添加条件判断：只有对应的值更新后才触发状态变更动作
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      })
    }
  }

  render() {
    let { data, cols, openType } = this.props
    let { value } = this.state
    return (
      <div className={styles.selectList}>
        {/* 选择器组件： */}
        <PickerView onChange={this.onChange} value={this.state.value} data={data} cols={cols} />

        {/* 底部按钮 */}
        <FilterFooter onSave={() => {
          this.props.onSave(openType, value)
        }} onCancel={this.props.onCancel}/>
      </div>
    )
  }
}
