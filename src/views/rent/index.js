import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { Link } from 'react-router-dom'
import API from '../../utils/index.js'
import HouseItem from '../../components/HouseItem/index.js'
import NoHouse from '../../components/NoHouse/index.js'
import styles from './index.module.css'

export default class Rent extends Component {
  state = {
    // 出租房屋列表
    list: []
  }

  // 获取已发布房源的列表数据
  async getHouseList() {
    const res = await API.get('/user/houses')
    const { status, body } = res
    if (status === 200) {
      this.setState({
        list: body
      })
    }
  }

  componentDidMount() {
    this.getHouseList()
  }

  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props

    return list.map(item => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => {
            history.push('/detail/', {
              houseCode: item.houseCode
            })
          }}
          houseImg={item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  renderRentList() {
    const { list } = this.state
    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type='left'/>}
          rightContent={
            <Icon onClick={() => {
              this.props.history.push('/rentadd')
            }} key="0" type="search" style={{ marginRight: '6px' }} />
          }
          onLeftClick={() => history.go(-1)}
        >
          房屋管理
        </NavBar>
        {this.renderRentList()}
      </div>
    )
  }
}
