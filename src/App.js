import React, {Suspense} from 'react';
import './App.css';
// import { Button } from 'antd-mobile'
// 导入路由相关组件
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import TestProxy from './views/test/test.js'

const Home = React.lazy(() => import('./views/Home.js'))
const Login = React.lazy(() => import('./views/login/index.js'))
const CityList = React.lazy(() => import('./views/citylist/index.js'))
const TestMap = React.lazy(() => import('./views/map/index.js'))
const TestHoc = React.lazy(() => import('./views/test/hoc1.js'))
const HouseDetail = React.lazy(() => import('./views/detail/index.js'))
const AuthCheck = React.lazy(() => import('./components/AuthCheck/index.js'))
const Rent = React.lazy(() => import('./views/rent/index.js'))
const RentAdd = React.lazy(() => import('./views/rent/Add/index.js'))
const RentSearch = React.lazy(() => import('./views/rent/Search/index.js'))
const TestSpring = React.lazy(() => import('./views/test/animation.js'))

// import Home from './views/Home.js'
// import Login from './views/login/index.js'
// import CityList from './views/citylist/index.js'
// import TestMap from './views/map/index.js'
// import TestHoc from './views/test/hoc1.js'
// import HouseDetail from './views/detail/index.js'
// import AuthCheck from './components/AuthCheck/index.js'
// import Rent from './views/rent/index.js'
// import RentAdd from './views/rent/Add/index.js'
// import RentSearch from './views/rent/Search/index.js'
// import TestSpring from './views/test/animation.js'

function NotFound () {
  return <div>404</div>
}

// function Abc () {
//   return <div>abc</div>
// }
function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <BrowserRouter>
        <Switch>
          <Redirect exact from='/' to='/login'/>
          <Route path='/login' component={Login}/>
          <Route path='/home' component={Home}/>
          <Route path='/detail' component={HouseDetail}/>
          <Route path='/map' component={TestMap}/>
          <Route path='/hoc' component={TestHoc}/>
          <Route path='/citylist' component={CityList}/>
          <Route path='/animation' component={TestSpring}/>
          <Route path='/test' component={TestProxy}/>
          <AuthCheck path='/rent' component={Rent}/>
          <AuthCheck path='/rentadd' component={RentAdd}/>
          <AuthCheck path='/rentsearch' component={RentSearch}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
