import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect} from "react-router-dom";
import { Layout } from 'antd';
import RHeader from "../../conponents/header/header";
import LeftNav from "../../conponents/left-nav/left-nav";

const { Header, Footer, Sider, Content } = Layout;

class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 当用户不存在的时候 跳转回登录页面
        if (!user || !user._id){
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header><RHeader/></Header>
                    <Content style={{backgroundColor: "palegreen"}}>Content</Content>
                    <Footer style={{backgroundColor: "blue"}} >推荐使用谷歌浏览器，可以获得最佳使用体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;