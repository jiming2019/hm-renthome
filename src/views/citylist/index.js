/*
  城市选择

  使用React.Fragment组件可以作为唯一的跟元素，但是它本身不会被渲染
  类似Vue中template标签，<template v-show='flag'></template>
  也类似于小程序中block标签
*/
import React from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile'
import API from '../../utils/index.js'
// import { List, AutoSizer } from 'react-virtualized'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import { getCurrentCity } from '../../utils/index.js'
import 'react-virtualized/styles.css'
import './index.scss'

// let list = ['第0行数据', '第1行数据', ....]
// let list = Array.from(new Array(100)).map(
//   (item, index) => `第${index}行数据`
// )

class CityList extends React.Component {

  state = {
    cityData: {
      cityIndex: [],
      cityObj: []
    },
    // 右侧索引当前选中
    activeIndex: 0
  }

  // 创建一个标签或者组件的引用对象
  listRef = React.createRef()
  
  loadCityData = async () => {
    // 加载城市列表的数据
    let res = await API.get('/area/city', {
      params: {
        level: 1
      }
    })
    // 处理之后的城市列表数据
    // {
    //   a: [{label: '安庆'}],
    //   b: [{label: '北京', label: '北海'}]
    //   #: [],
    //   hot: [],
    //   ....
    // }
    // ['#','hot','a', 'b', ...]
    let ret = this.formatCityData(res.body)

    // 获取热门城市
    let hotCity = await API.get('/area/hot')
    ret.cityObj.hot = hotCity.body
    ret.cityIndex.unshift('hot')

    // 添加当前城市
    ret.cityIndex.unshift('#')
    let city = await getCurrentCity()
    ret.cityObj['#'] = [city]
    
    this.setState({
      cityData: ret
    }, () => {
      // 数据完成更新后，计算列表的总高度，从而保证滚动的准确性
      this.listRef.current.measureAllRows()
    })

    // 隐藏提示效果
    Toast.hide()
  }

  formatCityData = (data) => {
    // 格式化城市列表数据
    let cityObj = {}
    let cityIndex = []
    data.forEach(item => {
      // 获取城市的首字母
      let firstLetter = item.short.substr(0, 1)
      // 将单个字符添加到数组中
      // cityIndex.push(firstLetter)
      // 判断cityObj中是否已经包含该字符
      // 如果包含，就继续添加一个新的城市
      // 否则，就初始化一个新的数组并且添加第一个城市
      if (cityObj.hasOwnProperty(firstLetter)) {
        // hasOwnProperty作用：判断对象中是否包含指定的属性
        // 包含
        cityObj[firstLetter].push(item)
      } else {
        // 不包含
        cityObj[firstLetter] = [item]
      }
    })

    // 先获取对象所有的key，然后对数组进行排序
    cityIndex = Object.keys(cityObj).sort()
    return {
      cityObj,
      cityIndex
    }
  }

  componentDidMount () {
    // 组件开始加载时进行提示
    Toast.loading('正在加载...', 0, null, false)
    // 调用接口获取数据
    this.loadCityData()
    // let w = document.documentElement.clientWidth
    // let h = document.documentElement.clientHeight
    // console.log(w, h)
  }

  renderCityList = () => {
    // 生成城市列表模板
    let { cityData } = this.state
    let cityIndex = cityData.cityIndex
    let cityObj = cityData.cityObj

    let list = []
    cityIndex && cityIndex.forEach((item, i) => {
      // 分组标题
      list.push(<div key={item + '-' + i}>{item}</div>)
      // 根据索引获取城市具体数据
      let city = cityObj[item]
      // 城市列表
      city.forEach((city, index) => {
        list.push(<div key={i + '-' + index}>{city.label}</div>)
      })
    })
    return list
  }

  rowRenderer = ({key, index, style}) => {
    // 渲染每一个条目的模板
    // key表示行的唯一标识
    // index表示行的索引
    // style表示行的样式
    let { cityIndex, cityObj } = this.state.cityData
    // 根据当前的索引，获取标题的字符
    let firstLetter = cityIndex[index]
    let cityList = cityObj[firstLetter]
    // 生成每一个分组下的城市列表
    let cityListTag = cityList.map(item => (
      <div 
        onClick={() => {
          // 获取点击的城市信息，并进行缓存
          // 只允许选择一线城市
          let fcity = ['北京', '上海', '广州', '深圳']
          if (!fcity.includes(item.label)) {
            // 不是一线城市，提示一下
            Toast.info('该城市暂无房源数据', 1, null, false)
            return 
          }
          // 是一线城市，缓存数据
          localStorage.setItem('currentCity', JSON.stringify({
            label: item.label, 
            value: item.value
          }))
          // 跳回主页
          this.props.history.push('/home')
        }}
        className="name" 
        key={item.value + firstLetter}>
          {item.label}
      </div>
    ))

    return (
      <div key={key} style={style} className='city'>
        <div className="title">{firstLetter}</div>
        {cityListTag}
      </div>
    )
  }

  calculateRowHeight = ({index}) => {
    // 动态计算当前行的高度
    let { cityIndex, cityObj } = this.state.cityData
    let firstLetter = cityIndex[index]
    let cityList = cityObj[firstLetter]
    // 行高的计算规则：标题的高度 + 每个城市高度 * 城市的数量
    return 36 + 50 * cityList.length
  }

  renderRightIndex = () => {
    // 生成右侧索引列表
    let { cityIndex } = this.state.cityData
    let { activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li key={index}
          onClick={() => {
            // 获取List组件的实例对象
            let list = this.listRef.current
            // console.log(cityIndex.length)
            // 调用组件的公共方法
            list.scrollToRow(index)
            // 只有点击索引最后一个字符时才触发
            if (cityIndex.length - 1 === index) {
              setTimeout(() => {
                this.setState({
                  activeIndex: index
                })
              }, 0)
            }
          }}  
          className="city-index-item">
        <span className={activeIndex===index?'index-active': ''}>
          {item==='hot'?'热': item.toUpperCase()}
        </span>
      </li>
    ))
  }

  onRowsRendered = ({startIndex}) => {
    // 监听列表的滚动
    // 根据startIndex值的变化更新右侧索引当前的值
    if (this.state.activeIndex !== startIndex) {
      // 如果当前的索引和startIndex不相等才进行状态更新
      // 可以防止setState频繁调用，从而提高性能
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render () {
    let { cityIndex } = this.state.cityData
    return (
      <React.Fragment>
        {/*顶部导航栏*/}
        <NavBar
          mode="light"
          className='cityNavbar'
          icon={<Icon type='left'/>}
          onLeftClick={() => {
            // 控制路由跳转
            // this.props.history.push('/home')
            // this.props.history.goBack()
            this.props.history.go(-1)
          }}
        >城市选择</NavBar>
        {/*<div>
          {this.renderCityList()}
        </div>*/}
        <div className='citilist'>
          <AutoSizer>
            {({height, width}) => (
              <List
                scrollToAlignment={'start'}
                ref={this.listRef}
                width={width}
                height={height}
                onRowsRendered={this.onRowsRendered}
                rowCount={cityIndex.length}
                rowHeight={this.calculateRowHeight}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
        {/* 右侧索引 */}
        <ul className='city-index'>
          {this.renderRightIndex()}
        </ul>
      </React.Fragment>
    )
  }
}

export default CityList