import React from 'react';
import './App.css';
// 导入路由组件
import {BrowserRouter,Route,Switch, Redirect} from 'react-router-dom'

import Home from './views/Home/home.js'
import Login from './views/Login/login.js'
import NotFound from './views/NotFound/notfound.js'
import City from './views/City/city.js'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from='/' to='/login'/>
        <Route path='/login' component={Login}/>
        <Route path='/home' component={Home}/>
        <Route path='/city' component={City}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
