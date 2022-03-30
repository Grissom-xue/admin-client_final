 /*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'
 import {BrowserRouter} from "react-router-dom";
import App from './App'
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";


// 一上来就读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

// 将App组件标签渲染到index页面的div上
ReactDOM.render(
<BrowserRouter>
    <App/>
</BrowserRouter>,
    document.getElementById('root'))