/*
  测试地图
*/

import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile'
import API, {getCurrentCity} from '../../utils/index.js'
import HouseItem from '../../components/HouseItem/index.js'
import './index.scss'
import styles from './index.module.css'

class TestMap extends React.Component {

  state = {
    cityList: [],
    houseList: [],
    isShow: false
  }

  // 绘制一级覆盖物
  drawFirstOverlay = (lng, lat, map) => {
    // 设置地图中心的坐标
    let point = new window.BMap.Point(lng, lat)
    // 参数一表示地图中心坐标，参数二表示缩放级别
    map.centerAndZoom(point, 11);   
    // 向地图中添加覆盖物
    const { cityList } = this.state
    cityList.forEach(item => {
      // 绘制单个地图覆盖物
      this.drawSingleOverlay(item, map, 'first')
    })
    // 隐藏提示
    Toast.hide()
  }

  // 绘制二级覆盖物
  drawSecondOverlay = async (item, map) => {
    Toast.loading('正在加载...', 0)
    // 1、调用后台接口获取二级覆盖数据
    let res = await API.get('/area/map', {
      params: {
        id: item.value
      }
    })
    // 2、清空当前覆盖物内容
    map.clearOverlays()
    // 3、放大地图
    let point = new window.BMap.Point(item.coord.longitude, item.coord.latitude)
    map.centerAndZoom(point, 13)
    // 4、批量绘制二级覆盖物
    res.body.forEach(info => {
      // 绘制单个覆盖物
      this.drawSingleOverlay(info, map, 'second')
    })
    Toast.hide()
  }

  // 绘制三级(小区)覆盖物
  drawThirdOverlay = async (item, map) => {
    Toast.loading('正在加载...', 0)
    // 1、调用接口获取小区聚合数据
    let res = await API.get('/area/map', {
      params: {
        id: item.value
      }
    })
    // 2、清空所有的覆盖物
    map.clearOverlays()
    // 3、放大地图
    let point = new window.BMap.Point(item.coord.longitude, item.coord.latitude)
    map.centerAndZoom(point, 15)
    // 4、批量绘制小区覆盖物
    res.body.forEach(info => {
      this.drawSingleOverlay(info, map, 'third')
    })
    Toast.hide()
  }

  // 渲染房源列表
  renderHouseList = async (item, map, e) => {
    // 1、调用接口获取列表数据
    let res = await API.get('/houses', {
      params: {
        cityId: item.value
      }
    })
    setTimeout(() => {
      this.setState({
        houseList: res.body.list,
        // 控制列表的显示
        isShow: true
      })
    }, 0)
    // 2、控制小区覆盖物移动到地图的中心
    // 鼠标点击时，屏幕可视区坐标
    let { clientX, clientY } = e.changedTouches[0]
    // 地图移动的距离 = 地图中心的坐标 - 鼠标点击时的坐标
    let x = window.innerWidth/2 - clientX
    let y = (window.innerHeight - 330)/2 - clientY
    // 参数x,y表示水平和竖直方向移动的距离
    map.panBy(x, y)
    // 3、监控地图的移动行为
    let eventHandle = () => {
      this.setState({
        isShow: false
      })
      map.removeEventListener('movestart', eventHandle)
    }
    map.addEventListener('movestart', eventHandle)
  }

  // 绘制单个覆盖物
  drawSingleOverlay = (item, map, type) => {
    // 向地图中添加覆盖物
    let point = new window.BMap.Point(item.coord.longitude, item.coord.latitude)
    let opts = {
      position: point,
      offset: new window.BMap.Size(-30, -30) 
    }
    // 创建地图覆盖物
    let bgColor = type === 'second'? 'orange': ''
    let content = `
      <div class='labelContent' style='background-color: ${bgColor}'>
        <div>${item.label}</div>
        <p>${item.count}套</p>
      </div>
    `
    if (type === 'third') {
      content = `
        <div class='areaContent'>
          <span>${item.label}</span>
          <span>${item.count}</span>
        </div>
      `
    }
    let label = new window.BMap.Label(content, opts);
    // 覆盖物事件绑定
    label.addEventListener('click', (e) => {
      if (type === 'first') {
        // 绘制二级覆盖物
        this.drawSecondOverlay(item, map)
      } else if (type === 'second') {
        // 绘制三级覆盖物
        this.drawThirdOverlay(item, map)
      } else if (type === 'third') {
        // 渲染房源列表
        this.renderHouseList(item, map, e)
      }
    })
    // 设置地图覆盖物样式
    label.setStyle({
      height : "0px",
      width: '0px',
      border: '0px'
    })
    // 添加覆盖物到地图中
    map.addOverlay(label)
  }

  initMap = () => {
    let map = new window.BMap.Map("mymap")
    // 获取当前的定位信息
    const position = new window.BMap.LocalCity()
    position.get((ret) => {
      const { lng, lat } = ret.center
      this.drawFirstOverlay(lng, lat, map)
    })
  }

  loadData = async () => {
    Toast.loading('正在加载...', 0)
    // 加载一级区域的地图列表数据
    let city = await getCurrentCity()
    let res = await API.get('/area/map', {
      params: {
        id: city.value
      }
    })
    this.setState({
      cityList: res.body
    })
  }

  renderHouseItems = () => {
    // 动态渲染房源列表
    let { houseList } = this.state
    return houseList.map(item => (
      <HouseItem onClick={() => {
        // 跳转到房源详情页面
        this.props.history.push('/detail', {
          houseCode: item.houseCode
        })
      }} key={item.houseCode} {...item}/>
    ))
  }

  async componentDidMount () {
    await this.loadData()
    this.initMap()
  }

  render () {
    const { history } = this.props
    return (
      <div className='map-container'>
        {/*导航栏*/}
        <NavBar
          className='nav-bar'
          mode="light"
          icon={<Icon type='left'/>}
          onLeftClick={() => history.go(-1)}
        >
          地图找房
        </NavBar>
        {/*地图*/}
        <div id='mymap' style={{height: '100%'}}></div>
        {/*房源列表*/}
        <div
          className={[styles.houseList, this.state.isShow ? styles.show : ''].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {this.renderHouseItems()}
          </div>
        </div>
      </div>
    )
  }
}

export default TestMap
