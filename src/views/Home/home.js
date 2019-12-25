// 主页组件
import React from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import {TabBar} from 'antd-mobile'
import './home.scss'
import Index from '../Index/index.js'
import Find from '../Find/find.js'
import Info from '../Info/info.js'
import My from '../My/my.js'

class Home extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       selectedTab: 'index'
     };
   }
 
   // 动态生成四个菜单
   renderMenuItem = () => {
     let menuData = [{
       key: 'index',
       title: '主页',
       icon: 'icon-ind'
     }, {
       key: 'find',
       title: '找房',
       icon: 'icon-findHouse'
     }, {
       key: 'info',
       title: '资讯',
       icon: 'icon-myinfo'
     }, {
       key: 'my',
       title: '我的',
       icon: 'icon-my'
     }]
     return menuData.map(item => (
       <TabBar.Item
         title={item.title}
         key={item.key}
         icon={<i className={'iconfont ' + item.icon}></i>}
         selectedIcon={<i className={'iconfont ' + item.icon}></i>}
         selected={this.state.selectedTab === item.key}
         onPress={() => {
           // 菜单的点击事件
           this.setState({
             selectedTab: item.key
           });
           // 编程式导航控制路由跳转
           this.props.history.push('/home/' + item.key)
         }}
       />
     ))
   }
 
   render () {
     return (
       <div className='menu'>
         {/*顶部内容区*/}
         <Switch>
           <Redirect exact from='/home' to='/home/index'/>
           <Route path='/home/index' component={Index}/>
           <Route path='/home/find' component={Find}/>
           <Route path='/home/info' component={Info}/>
           <Route path='/home/my' component={My}/>
         </Switch>
         {/*底部菜单区域*/}
         {/*<Link to='/home/index'>首页</Link>
         <Link to='/home/find'>找房</Link>
         <Link to='/home/info'>资讯</Link>
         <Link to='/home/my'>我的</Link>*/}
         <TabBar noRenderContent={true}>
           {this.renderMenuItem()}
         </TabBar>
       </div>
     )
   }
 }
export default Home