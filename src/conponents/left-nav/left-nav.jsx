import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { Menu, Icon } from 'antd';
import menuList from "../../config/menuConfig";
import './left-nav.less'
import logo from '../../assets/images/logo.webp'

const { SubMenu } = Menu;

export default class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        // 根据menu的数据数组生成对应的标签数组
        return menuList.map((item) => {
            /**
             * {
             *         title: '首页', // 菜单标题名称
             *         key: '/home', // 对应的path
             *         icon: 'home', // 图标名称
             *         children:[],//可能有也可能没有
             *         isPublic: true, // 公开的
             *     },
             */
            if (!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}><Icon type={item.icon} /><span>{item.title}</span></Link>
                    </Menu.Item>
                )
            }else {
                return (
                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                        {/*{item.children.map((children) => {*/}
                        {/*    return (*/}
                        {/*        <Menu.Item key={children.key}>*/}
                        {/*            <Link to={children.key}><Icon type={children.icon} />{children.title}</Link>*/}
                        {/*        </Menu.Item>)*/}
                        {/*} )}*/}

                        {/*下面采用了递归调用的方式*/}
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }

        } )
    }
    render() {
        return (
            // 商标区域点击之后需要跳转到Home页面 预留好 后面有用
            <div className='left-nav'>
                <Link  to='/home'  className="left-nav-header">
                    <img src={logo} alt="logo"/>
                </Link>
                <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="dark">
                    {
                        this.getMenuNodes(menuList)
                    }
                </Menu>
            </div>
        );
    }
}