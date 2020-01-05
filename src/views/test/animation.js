/*
  React-spring动画库基本用法
*/
import React from 'react'
import {Spring} from 'react-spring/renderprops'
import './animation.css'

function Test (props) {
  return (
    <div className='test' style={props.attr}>
      <div>TOM</div>
      <div>JERRY</div>
    </div>
  )
}

// class TestSpring extends React.Component {
//   render () {
//     return (
//       <div>
//         <Spring 
//           from={{ opacity: 0, width: 100, height: 100 }} 
//           to={{ opacity: 1, width: 200, height: 200 }}>
//           {(props) => {
//             console.log(props)
//             return (
//               <div 
//                 className='test'
//                 style={props}>
//                 动画
//               </div>
//             )
//           }}
//         </Spring>
//       </div>
//     )
//   }
// }

class TestSpring extends React.Component {
  render () {
    return (
      <div>
        <Spring 
          from={{ opacity: 0, width: 100, height: 100 }} 
          to={{ opacity: 1, width: 200, height: 200 }}>
          {(props) => {
            console.log(props)
            return (
              <Test attr={props}/>
            )
          }}
        </Spring>
      </div>
    )
  }
}


export default TestSpring