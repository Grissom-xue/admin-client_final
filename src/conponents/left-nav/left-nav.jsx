import React, {Component} from 'react';
import {Link,withRouter} from "react-router-dom";
import { Menu, Icon } from 'antd';
import menuList from "../../config/menuConfig";
import './left-nav.less'
import logo from '../../assets/images/logo.webp'

const { SubMenu } = Menu;

class LeftNav extends Component {
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
    getMenuNodes2 = (menuList) => {
        const path = this.props.location.pathname
        // reduce + 递归
        return menuList.reduce((pre,item) => {
            if (!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}><Icon type={item.icon} /><span>{item.title}</span></Link>
                    </Menu.Item>
                    )
                )
            }else {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果找到了 说明当前item的子列表需要展开
                if (cItem){
                    this.openKey = item.key
                }
                pre.push((
                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                        {/*下面采用了递归调用的方式*/}
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                ))
            }
            return pre
        },[])

    }

    // 在第一次render之前执行一次 为第一个render准备数据
    componentWillMount() {
        this.menuNodes = this.getMenuNodes2(menuList)
    }

    render() {
        // debugger
        const path = this.props.location.pathname
        return (

            // 商标区域点击之后需要跳转到Home页面 预留好 后面有用
            <div className='left-nav'>
                <Link  to='/home'  className="left-nav-header">
                    <img src={logo} alt="logo"/>
                </Link>
                {/*// 设置默认高亮的地方*/}
                <Menu selectedKeys={[path]}
                      defaultOpenKeys={[this.openKey]}
                      mode="inline"
                      theme="dark">
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }

}

/**
 * withRouter 高阶组件：
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由组件传递三个属性： history，location，match
 */
export default withRouter(LeftNav)