import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import './header.less'
import {reqWeather} from "../../api";
import {formateDate} from "../../utils/dateUtils";
import {message,Modal} from "antd";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/link-button";


class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        name: '',
        weather:''
    }
    getTime = () => {
        this.intervalId =  setInterval(() => {
           const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather = async () => {
        const weatherResponse = await reqWeather()
        const name = weatherResponse.result.location.name
        const weather = weatherResponse.result.now.text
        //天气请求返回成功
        if (weatherResponse.message==="success" && weatherResponse.status===0){
            this.setState({name,weather})
        }else {
            message.error(weatherResponse.message)
        }
    }
    getTitle = () => {
        const path = this.props.location.pathname
        console.log(path)
        let title
        menuList.forEach((item) => {
            if (item.key===path){
                title=item.title
            }else if (item.children){
                const cItem = item.children.find(cItem=>cItem.key===path)
                if (cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }
    logout =() => {
        Modal.confirm({
            title: 'Are you sure delete this task?',
            onOk: () => {
                console.log("退出")
                // 删除保存的user数据 & 跳转到登录界面
                storageUtils.removeUser()
                memoryUtils.user={}
                this.props.history.replace('/login')
            }
        })
    }
    /**
     * 第一render之后执行一次
     * 一般在此执行异步操作：发送Ajax请求、启动定时器等
     */
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }


    const
    render() {
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎,{username}</span>
                    <LinkButton href="#" onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left"><span>{title}</span></div>
                    <div className="header-bottom-right">
                            <span>{this.state.currentTime}</span>
                            <span>{this.state.name}</span>
                            <span>{this.state.weather}</span>
                    </div>
                </div>

            </div>
        );
    }
}
export default withRouter(Header)