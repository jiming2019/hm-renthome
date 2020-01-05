import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    mvalue: this.props.defaultValue
  }

  handleClick = (e) => {
    // 控制标签的选择:点击之后选中，再点取消渲染
    let { mvalue } = this.state
    let newMvalue = [...mvalue]
    let v = e.target.dataset.value
    if (newMvalue.includes(v)) {
      // 已经存在，就删除
      let index = newMvalue.findIndex(item => {
        return item === v
      })
      console.log(index)
      if (index !== -1) {
        // 删除该数据
        newMvalue.splice(index, 1)
      }
    } else {
      // 不存在，就添加
      newMvalue.push(v)
    }
    this.setState({
      mvalue: newMvalue.length === 0? '': newMvalue
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    let { mvalue } = this.state
    return data.map(item => (
      <span 
        onClick={this.handleClick}
        key={item.value} 
        data-value={item.value}
        className={[styles.tag, mvalue.includes(item.value)? styles.tagActive: ''].join(' ')}>
        {item.label}
      </span>
    ))
  }

  render() {
    let { onCancel, onSave, data: {roomType, oriented, floor, characteristic}} = this.props
    let { mvalue } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onSave={() => {
          onSave('more', mvalue)
        }} className={styles.footer} />
      </div>
    )
  }
}
