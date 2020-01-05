import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import API, { getCurrentCity } from '../../../../utils/index.js'
import styles from './index.module.css'
import Sticky from '../../../../components/Sticky/index.js'
import {Spring} from 'react-spring/renderprops'

export default class Filter extends Component {

  state = {
    // 4个菜单的高亮状态
    menuStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 4个菜单选中的值
    menuVale: {
      area: '',
      mode: '',
      price: '',
      more: ''
    },
    // 下拉弹窗条件列表数据
    filtersData: [],
    // 当前选中的菜单
    openType: ''
  }

  loadData = async () => {
    // 获取当前城市信息
    let city = await getCurrentCity()
    // 获取弹窗条件列表数据
    let res = await API.get('/houses/condition', {
      params: {
        id: city.value
      }
    })
    this.setState({
      filtersData: res.body
    })
  }

  componentDidMount () {
    this.loadData()
    // 页面加载时，获取body元素
    this.bodyDOM = window.document.body
  }

  changeStatus = (type) => {
    // 控制body的滚动行为
    this.bodyDOM.className = styles.scrollAuto
    // 不要把自定义属性直接绑定到第三方组件中，因为不方便获取自定义属性值
    // 修改菜单的高亮状态
    // let newStatus = {...this.state.menuStatus}
    // newStatus[type] = true
    // this.setState({
    //   menuStatus: newStatus
    // })
    let { menuVale, menuStatus } = this.state
    let newStatus = {...menuStatus}

    // 点击某个菜单时，需要判断4次
    Object.keys(menuStatus).forEach(item => {
      // 点击筛选菜单时，控制高亮（选中值进行高亮，否则不高亮）
      if (type === item) {
        // 当前点击的菜单先进行高亮
        newStatus[item] = true
      } else if (item === 'area' && menuVale.area) {
        newStatus.area = true
      } else if (item === 'mode' && menuVale.mode) {
        newStatus.mode = true
      } else if (item === 'price' && menuVale.price) {
        newStatus.price = true
      } else if (item === 'more' && menuVale.more) {
        newStatus.more = true
      } else {
        // 如果没有选中值，就恢复没有选中状态
        newStatus[item] = false
      }
    })

    this.setState({
      menuStatus: newStatus,
      openType: type
    })


    // 等效写法
    // this.setState({
    //   menuStatus: {
    //     ...this.state.menuStatus,
    //     // 对象属性的名称可以是动态的
    //     [type]: true
    //   },
    //   // 当前选中的筛选条件
    //   openType: type
    // })
  }

  onCancel = () => {
    // 继续允许列表的滚动
    this.bodyDOM.className = ''
    // 判断当前条件是否高亮
    let { menuStatus, menuVale, openType } = this.state
    let newStatus = {...menuStatus}
    let v = menuVale[openType]
    if (v) {
      // 当前选择的条件有值
      newStatus[openType] = true
    } else {
      newStatus[openType] = false
    }

    // 控制弹窗的关闭
    this.setState({
      openType: '',
      menuStatus: newStatus
    })
  }

  onSave = (type, value) => {
    // 通过BOM的API方式控制列表回到顶部
    window.scrollTo(0, 0)
    // 继续允许列表的滚动
    this.bodyDOM.className = ''
    // 判断当前条件是否高亮
    let { menuStatus } = this.state
    let newStatus = {...menuStatus}
    if (value) {
      // 选中值了，就进行高亮
      newStatus[type] = true
    } else {
      newStatus[type] = false
    }
    // 控制弹窗的关闭
    this.setState({
      menuVale: {
        ...this.state.menuVale,
        [type]: value
      },
      menuStatus: newStatus,
      openType: ''
    }, () => {
      let { menuVale } = this.state
      // 组合请求参数
      let filter = {}
      // 1、区域筛选
      if (menuVale.area) {
        // 选中了条件，取出数组第一项数据:area或者subway
        let key = menuVale.area[0]
        // 判断数组第三项值是否为null
        if (menuVale.area[2] === 'null') {
          // 仅仅选择了两项数据，获取第二项数据
          filter[key] = menuVale.area[1]
        } else {
          // 选择了三项数据，获取第三项数据
          filter[key] = menuVale.area[2]
        }
      }
      // 2、方式筛选
      if (menuVale.mode) {
        // 选中条件
        filter.rentType = menuVale.mode[0]
      }
      // 3、租金筛选
      if (menuVale.price) {
        // 选中条件
        filter.price = menuVale.price[0]
      }
      // 4、更多筛选
      if (menuVale.more) {
        // 选中条件
        filter.more = menuVale.more.join(',')
      }
      // 将组合好的请求参数传递给父组件
      this.props.onFilter(filter)
    })
  }

  renderMask = (openType) => {
    // 封装一个方法，实现半透明背景的渲染
    let isHide = (openType === 'area' || openType === 'mode' || openType === 'price')? true: false
    return (
      <Spring from={{opacity: 0}} to={{opacity: isHide? 1: 0}}>
        {(props) => {
          console.log(props)
          if (props.opacity === 0) {
            // 如果透明度是0，那么就不渲染背景
            return null
          } else {
            return <div style={props} className={styles.mask}></div>
          }
        }}
      </Spring>
    )
  }

  render() {
    let { 
      openType,
      menuVale,
      filtersData: { area, subway, rentType, price, roomType, oriented, floor, characteristic }
    } = this.state
    // 根据点击的筛选条件组件弹窗的列表数据

    let data = null
    let cols = 1
    // 获取下拉选框的默认值
    let defaultValue = menuVale[openType]
    
    // 下拉弹窗组件只有一份，但是数据可以动态填充
    switch(openType){
      case 'area':
        // 区域筛选
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        // 方式筛选
        data = rentType
        cols = 1
        break;
      case 'price':
        // 组件筛选
        data = price
        cols = 1
        break;
      case 'more':
        // 组件筛选
        data = {roomType, oriented, floor, characteristic}
        break;
      default:
        break;
    }

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/*{openType === 'area' || openType === 'mode' || openType === 'price' ? <div className={styles.mask} />: null}*/}
        {this.renderMask(openType)}

        <div className={styles.content}>
          {/* 标题栏 */}
          <Sticky height={40}>
            <FilterTitle changeStatus={this.changeStatus} menuStatus={this.state.menuStatus}/>
            {/* 前三个菜单对应的内容： */}
            {openType === 'area' || openType === 'mode' || openType === 'price' ? <FilterPicker defaultValue={defaultValue} openType={openType} data={data} cols={cols} onSave={this.onSave} onCancel={this.onCancel}/>: null}
          </Sticky>

          {/* 最后一个菜单对应的内容： */}
          {openType === 'more' && <FilterMore defaultValue={defaultValue} onCancel={this.onCancel} onSave={this.onSave} data={data}/>}
        </div>
      </div>
    )
  }
}
