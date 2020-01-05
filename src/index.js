import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// 导入字体图标样式
import './assets/fonts/iconfont.css'

// 导入antdesign样式
// import 'antd-mobile/dist/antd-mobile.css'; 

// ReactDOM.render(<Suspense fallback={<div>loading...</div>}><App /></Suspense>, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('root'));
