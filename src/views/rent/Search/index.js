import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import API, { getCurrentCity } from '../../../utils/index.js'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  // cityId = getCurrentCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  onChange = (value) => {
    this.setState({
      searchTxt: value
    })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li data-id={item.community} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  onSubmit = async () => {
    // 回车后触发，根据输入的关键字搜索小区名称列表
    let city = await getCurrentCity()
    let res = await API.get('/area/community', {
      params: {
        id: city.value,
        name: this.state.searchTxt
      }
    })
    this.setState({
      tipsList: res.body
    })
  }

  handleSelect = (e) => {
    // 控制列表项的选中
    // console.log(e.target)
    let id = e.target.dataset.id
    let name = e.target.innerHTML
    // 控制路由跳转，回退到去出租页面
    this.props.history.replace('/rentadd', {
      id: id,
      name: name
    })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onCancel={() => {
            history.replace('/rentadd')
          }}
        />

        {/* 搜索提示列表 */}
        <ul onClick={this.handleSelect} className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
