import React, {Component} from 'react';
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route, Switch} from "react-router-dom";
import { Layout } from 'antd';
import Header from "../../conponents/header/header";
import LeftNav from "../../conponents/left-nav/left-nav";
import Home from "../home/home";
import Category from "../category/category";
import Bar from "../chars/bar";
import Line from "../chars/line";
import Pie from "../chars/pie";
import Role from "../role/role";
import User from "../user/User";
import Product from "../product/product";


const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 当用户不存在的时候 跳转回登录页面
        if (!user || !user._id){
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider><LeftNav/></Sider>
                <Layout>
                    {/*子组件写法比较特别*/}
                    <Header>Header</Header>
                    <Content>
                        {/*<BrowserRouter>*/}
                            <Switch> {/*只匹配其中一个*/}
                                <Route path='/home' component={Home}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route path='/category' component={Category}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/charts/bar' component={Bar}/>
                                <Route path='/charts/line' component={Line}/>
                                <Route path='/charts/pie' component={Pie}/>
                                <Redirect to='/home'/>
                            </Switch>
                        {/*</BrowserRouter>*/}
                    </Content>
                    <Footer style={{textAlign: 'center',color: '#ccc',backgroundColor: '#000D17'}} >推荐使用谷歌浏览器，可以获得最佳使用体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;