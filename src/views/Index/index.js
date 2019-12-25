/*
  主页模块
*/
import React from 'react'
import { Carousel, Flex, Grid, NavBar, Icon} from 'antd-mobile'
import './index.scss'
import API, {IMG_BASE_URL} from '../../utils/index.js'
import img1 from '../../assets/images/nav-1.png'
import img2 from '../../assets/images/nav-2.png'
import img3 from '../../assets/images/nav-3.png'
import img4 from '../../assets/images/nav-4.png'

class Index extends React.Component {

  state = {
    // 轮播图数据
    swiperData: [],
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
      name: '去出租'
    }],
    // 租房小组数据
    groupData: [],
    // 最新资讯数据
    newsData:[],
    // 轮播图片初始高度
    imgHeight: 176
  }

  // 加载轮播图接口数据
  loadSwiper = async () => {
    let res = await API.get('home/swiper')
    this.setState({
      swiperData: res.body
    })
  }

  // 加载租房小组接口数据
  loadGroup = async () => {
    let res = await API.get('home/groups')
    this.setState({
      groupData: res.body
    })
  }

  // 加载最新资讯接口数据
  loadNews = async () => {
    let res = await API.get('home/news')
    this.setState({
      newsData: res.body
    })
  }

  // 生命周期函数
  componentDidMount () {
    this.loadSwiper()
    this.loadGroup()
    this.loadNews()
  }

  // 动态生成轮播图条目
  renderSwiperImem = () => {
    return this.state.swiperData.map((item, index) => (
      <img 
        key={index}
        src={IMG_BASE_URL + item.imgSrc} 
        style={{height: this.state.imgHeight}}
        onLoad={() => {
          // 解决初次加载图片没有高度问题
          window.dispatchEvent(new Event('resize'));
          this.setState({ imgHeight: 'auto' });
        }}
        alt=""/>
    ))
  }

  // 动态生成菜单项
  renderMenuItem = () => {
    return this.state.menuData.map(item => (
      <Flex.Item key={item.id}>
        <img src={item.imgSrc} alt=""/>
        <p>{item.name}</p>
      </Flex.Item>
    ))
  }

  // 生成最新资讯的列表模板
  renderNewsItem = () => {
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
          icon={<div>北京</div>}
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
        {/*首页菜单*/}
        <Flex className='menu'>
          {this.renderMenuItem()}
        </Flex>
        {/*租房小组标题*/}
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
                <Flex className="grid-item" justify="between">
                  <div className="desc">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <img src={`${IMG_BASE_URL}${item.imgSrc}`} alt="" />
                </Flex>
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