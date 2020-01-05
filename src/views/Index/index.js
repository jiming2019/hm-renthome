/*
  主页模块
*/
import React from 'react'
import { Carousel, Flex, Grid, WingBlank, NavBar, Icon } from 'antd-mobile'
import './index.scss'
// import axios from 'axios'
import API, {IMG_BASE_URL, getCurrentCity} from '../../utils/index.js'
import img1 from '../../assets/images/nav-1.png'
import img2 from '../../assets/images/nav-2.png'
import img3 from '../../assets/images/nav-3.png'
import img4 from '../../assets/images/nav-4.png'

class Index extends React.Component {

  state = {
    // swiperData: [{
    //   imgSrc: 'https://zos.alipayobjects.com/rmsportal/AiyWuByWklrrUDlFignR.png'
    // }, {
    //   imgSrc: 'https://zos.alipayobjects.com/rmsportal/TekJlZRVCjLFexlOCuWn.png'
    // }, {
    //   imgSrc: 'https://zos.alipayobjects.com/rmsportal/IJOtIlfsYdTyaDTRVrLI.png'
    // }]
    swiperData: [],
    currentCity: '北京',
    menuData: [{
      id: 1,
      imgSrc: img1,
      name: '整租'
    }, {
      id: 2,
      imgSrc: img2,
      name: '合租'
    }, {
      id: 3,
      imgSrc: img3,
      name: '地图找房'
    }, {
      id: 4,
      imgSrc: img4,
      name: '去出租',
      path: '/rentadd'
    }],
    groupData: [],
    newsData: [],
    imgHeight: 176
  }

  loadSwiper = async () => {
    // 加载轮播图接口数据
    let res = await API.get('home/swiper')
    this.setState({
      swiperData: res.body
    })
  }

  loadGroup = async () => {
    // 加载租房小组接口数据
    let res = await API.get('home/groups')
    this.setState({
      groupData: res.body
    })
  }

  loadNews = async () => {
    // 加载最新资讯接口数据
    let res = await API.get('home/news')
    this.setState({
      newsData: res.body
    })
  }

  async componentDidMount () {
    this.loadSwiper()
    this.loadGroup()
    this.loadNews()
    // 从本地缓存获取当前城市的数据
    // let city = localStorage.getItem('currentCity')
    // let obj = null
    // if (city) {
    //   obj = JSON.parse(city)
    //   this.setState({
    //     currentCity: obj.label
    //   })
    // } else {
    //   // 通过地理定位获取当前城市
    //   const position = new window.BMap.LocalCity()
    //   position.get( async (ret) => {
    //     this.setState({
    //       currentCity: ret.name
    //     })
    //     // 根据地理定位得到的城市名称获取城市的详细信息
    //     let res = await API.get('/area/info', {
    //       params: {
    //         name: ret.name
    //       }
    //     })
    //     // 缓存当前城市数据
    //     localStorage.setItem('currentCity', JSON.stringify(res.body))
    //   })
    // }
    let city = await getCurrentCity()
    this.setState({
      currentCity: city.label
    })
    // .then(city => {
    //   this.setState({
    //     currentCity: city.label
    //   })
    // })
    
  }

  renderSwiperImem = () => {
    // 动态生成轮播图条目
    return this.state.swiperData.map((item, index) => (
      <img 
        style={{height: this.state.imgHeight}}
        key={index} 
        src={IMG_BASE_URL + item.imgSrc} 
        onLoad={() => {
          // fire window resize event to change height
          window.dispatchEvent(new Event('resize'));
          this.setState({ imgHeight: 'auto' });
        }}
        alt=""/>
    ))
  }

  renderMenuItem = () => {
    // 动态生成菜单项
    return this.state.menuData.map(item => (
      <Flex.Item key={item.id} onClick={() => {
        // 控制路由跳转
        if (item.path) {
          this.props.history.push(item.path)
        }
      }}>
        <img src={item.imgSrc} alt=""/>
        <p>{item.name}</p>
      </Flex.Item>
    ))
  }

  renderNewsItem = () => {
    // 生成最新资讯的列表模板
    return this.state.newsData.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`${IMG_BASE_URL}${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render () {
    return (
      <div>
        {/* 顶部导航栏 */}
        <NavBar
          mode="dark"
          icon={<div>{this.state.currentCity}</div>}
          onLeftClick={() => {
            // 控制路由跳转
            this.props.history.push('/citylist')
          }}
          rightContent={
            <Icon key="0" type="search" style={{ marginRight: '6px' }} />
          }
        >首页</NavBar>
        {/* 轮播图 */}
        <Carousel autoplay={true} infinite={true}>
          {this.renderSwiperImem()}
        </Carousel>
        {/* 首页菜单 */}
        <Flex className='menu'>
          {this.renderMenuItem()}
        </Flex>
        {/* 租房小组标题 */}
        <div className="group">
          <Flex className="group-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/*租房小组列表*/}
          <Grid data={this.state.groupData}
            columnNum={2}
            square={false}
            renderItem={item => (
              <WingBlank size='sm'>
                <Flex className="grid-item" justify="between">
                  <div className="desc">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <img src={`${IMG_BASE_URL}${item.imgSrc}`} alt="" />
                </Flex>
              </WingBlank>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          {this.renderNewsItem()}
        </div>
      </div>
    )
  }
}

export default Index