// 资讯模块
import React from 'react'
import { NavBar, Icon,Toast } from 'antd-mobile'
import API from '../../utils/index.js'
import { List, AutoSizer } from 'react-virtualized'
import { getCurrentCity } from '../../utils/index.js'
import 'react-virtualized/styles.css'
import './city.scss'

class City extends React.Component {
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

   // 加载城市列表的数据
   loadCityData = async () => {
      let cityList = await API.get('/area/city', {
         params: {
            level: 1
         }
      })
      let result = this.formatCityData(cityList.body)
      console.log(result)
      
      // 重构数据,添加热门城市到result中
      let hotCity = await API.get('/area/hot')
      result.cityObj.hot = hotCity.body
      result.cityIndex.unshift('hot')

      // 重构数据,添加当前城市到result中
      result.cityIndex.unshift('#')
      let city = await getCurrentCity()
      result.cityObj['#'] = [city]

      this.setState({
         cityData: result
      },() => {
         // 数据完成更新后，计算列表的总高度，从而保证滚动的准确性
         this.listRef.current.measureAllRows()
      })

      // 加载完成隐藏提示效果
      Toast.hide()
   }

   // 格式化城市列表数据
   // 处理之后的城市列表数据
    // {
    //   #: [],
    //   hot: [],
    //   a: [{label: '安庆'}],
    //   b: [{label: '北京', label: '北海'}]
    //   ....
    // }
    // ['#','hot','a', 'b', ...]
   //  item{label: "北京", value: "AREA|88cff55c-aaa4-e2e0", pinyin: "beijing", short: "bj"}
   //  a:{label: "安庆", value: "AREA|b4e8be1a-2de2-e039", pinyin: "anqing", short: "aq"}
   formatCityData = (data) => {
      let cityObj = {}
      let cityIndex = []
      data.forEach(item=>{
         // 获取城市的首字母
         let firstLetter = item.short.substr(0, 1)
         // 1、判断cityObj中是否已经包含该字符
         // 2、如果包含，就继续添加一个新的城市
         // 3、否则，就初始化一个新的数组并且添加第一个城市
         if(cityObj.hasOwnProperty(firstLetter)) {
            cityObj[firstLetter].push(item)
         }else {
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
      this.loadCityData()
   }

   // 生成城市列表模板
   renderCityList = () => {
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

   // 渲染每一个条目的模板
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

   // 动态计算当前行的高度
   calculateRowHeight = ({index}) => { 
      let { cityIndex, cityObj } = this.state.cityData
      let firstLetter = cityIndex[index]
      let cityList = cityObj[firstLetter]
      // 行高的计算规则：标题的高度 + 每个城市高度 * 城市的数量
      return 36 + 50 * cityList.length
   }

   // 生成右侧索引列表
   renderRightIndex = () => {
      let { cityIndex } = this.state.cityData
      let { activeIndex } = this.state
      return cityIndex.map((item, index) => (
         <li 
            key={index}
            className="city-index-item"
            onClick={() => {
               // 获取List组件的实例对象
               let list = this.listRef.current
               // 调用组件的公共方法
               list.scrollToRow(index)

               // 修复右侧最后一个索引选中高亮问题
               if(cityIndex.length-1 === index) {
                  setTimeout(()=>{
                     this.setState({
                        activeIndex:index
                     })
                  },0)
               }
             }}  
            >
            <span className={activeIndex===index?'index-active': ''}>
               {item==='hot'?'热': item.toUpperCase()}
            </span>
         </li>
      ))
   }

   // 动态选中右侧索引
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

         {/* <div>
            {this.renderCityList()}
         </div> */}
         <div className='citilist'>
            <AutoSizer>
               {({height, width}) => (
                  <List
                     width={width}
                     height={height}
                     rowCount={cityIndex.length}
                     rowHeight={this.calculateRowHeight}
                     rowRenderer={this.rowRenderer}
                     onRowsRendered={this.onRowsRendered}
                     scrollToAlignment={'start'}
                     ref={this.listRef}
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

export default City