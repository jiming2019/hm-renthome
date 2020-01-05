/*
  找房模块
*/
import React from 'react'
import { Flex, Toast, WingBlank } from 'antd-mobile'
import './index.scss'
import API, { getCurrentCity } from '../../utils/index.js'
import Filter from './components/Filter/index.js'
// import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import 'react-virtualized/styles.css'
import HouseItem from '../../components/HouseItem/index.js'
import NoHouse from '../../components/NoHouse/index.js'

class Find extends React.Component {
  
  state = {
    currentCity: '',
    filter: {},
    total: -1,
    listData: [],
    // 判断当前请求是否成功
    isLoading: true,
    // 控制加载方式（首次加载列表还是滚动分页加载）
    loadFlag: false
  }

  async componentDidMount () {
    // 获取当前城市名称
    let res = await getCurrentCity()
    this.setState({
      currentCity: res.label,
      loadFlag: false
    })
    // 页面首次加载时，触发接口调用
    this.loadData()
  }

  onFilter = (filter) => {
    this.setState({
      filter: filter,
      loadFlag: false
    })
    this.loadData()
  }

  loadData = async (start, end) => {
    // 全局提示
    Toast.info('正在加载...', 0)
    this.setState({
      isLoading: false
    })
    // 根据请求参数，获取后台接口数据
    return new Promise(async (resolve) => {
      let city = await getCurrentCity()
      let { filter, loadFlag } = this.state
      filter.cityId = city.value
      // 分页参数：从1开始，不是0
      filter.start = start
      filter.end = end
      let res = await API.get('/houses', {
        params: filter
      })
      this.setState({
        total: res.body.count,
        // 把加载到的新的一页数据追加到原有的数组中
        // 第一次加载列表数据和点击筛选确定按钮加载数据直接覆盖原有内容
        // 如果是分页滚动加载，就进行累加操作
        listData: loadFlag? [...this.state.listData, ...res.body.list]: res.body.list
      }, () => {
        // 任务完成
        Toast.hide()
        this.setState({
          isLoading: true
        })
        resolve()
      })
    })
  }

  rowRenderer = ({index, key, style}) => {
    // return <div style={style} key={key}>内容：{index}</div>
    // 获取每个列表条目的数据
    let { listData } = this.state
    let itemData = listData[index]
    // 如果列表滚动过快，那么itemData有可能还没有值
    if (!itemData) {
      // 数据尚未加载成功，先进行提示，等数据加载成功后再进行替换
      return (
        <div style={style} key={key}>
          <p className='loading'></p>
        </div>
      )
    }
    return <HouseItem onClick={() => {
      // 通过编程式导航跳转到详情页面
      this.props.history.push('/detail', {
        houseCode: itemData.houseCode
      })
    }} style={style} key={key} {...itemData}/>
  }

  isRowLoaded =  ({ index }) => {
    let { listData } = this.state
    // 判断当前索引是否可以获取到数据
    return !!listData[index]
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    // 加载更多数据：两个形参其实就是分页参数
    this.setState({
      loadFlag: true
    })
    return this.loadData(startIndex, stopIndex)
  }

  render () {
    let { currentCity, listData, total, isLoading } = this.state
    return (
      <div className='find'>
        {/*顶部导航栏*/}
        <Flex className='header'>
          <i className="iconfont icon-back" />
          <Flex className='search-box searchHeader'>
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div className="location" >
                <span className="name">{currentCity}</span>
                <i className="iconfont icon-arrow" />
              </div>
              {/* 搜索表单 */}
              <div className="form" >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i onClick={() => {
              this.props.history.push('/map')
            }} className="iconfont icon-map" />
          </Flex>
        </Flex>
        {/*筛选条件菜单*/}
        <Filter onFilter={this.onFilter}/>
        {/*房源列表*/}
        <div className='list-find'>
          <WingBlank>
            <InfiniteLoader 
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={total}
              >
              {({ onRowsRendered, registerChild }) => {
                return (
                  <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => {
                      return (
                        <AutoSizer>
                          {({width}) => {
                            if (listData.length > 0) {
                              return (
                                <List
                                  autoHeight
                                  width={width}
                                  onRowsRendered={onRowsRendered}
                                  ref={registerChild}
                                  height={height}
                                  isScrolling={isScrolling}
                                  onScroll={onChildScroll}
                                  scrollTop={scrollTop}
                                  rowCount={total}
                                  rowHeight={110}
                                  rowRenderer={this.rowRenderer}
                                />
                              )
                            }
                          }}
                        </AutoSizer>
                      )
                    }}
                  </WindowScroller>
                )
              }}
            </InfiniteLoader>
          </WingBlank>
          {/*如果没有数据，就渲染没有房源的提示信息*/}
          {(isLoading && total === 0) && <NoHouse>没有房源</NoHouse>}
        </div>
      </div>
    )
  }
}

export default Find