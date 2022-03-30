import React, {Component} from 'react';
import {Button, Form, Icon, Input, message} from 'antd';
import './login.less'
import logo from '../../assets/images/logo.webp'
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";


class Login extends Component {

    handleSubmit =(event) => {
        event.preventDefault()
        //form.getFieldsValue() 可以将表单中所有数据都给取出来，以一个对象的形式返回
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username,password} = values
                const result = await reqLogin(username,password)
                if (result.status===0){
                    const user = result.data
                    memoryUtils.user = user//保存到内存中去
                    storageUtils.saveUser(user)//保存到本地存储中去
                    //success
                    message.success('login success')
                    // 跳转到后台管理界面(不需要回退的操作)
                    this.props.history.replace('/')
                }else {
                    // 接口返回登录失败的信息
                    message.error(result.msg)
                }
            }else {
                console.log('校验失败')
            }
        });

    }
    render() {
        // 如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user;
        if (user&&user._id){
            return <Redirect to='/home'/>
        }


        //form对象拥有一系列表单校验等功能
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img className="login-header-img" src={logo} alt="logo"/>
                    <h1>React后台管理项目</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">

                        <Form.Item>
                            {getFieldDecorator('username', {
                                //配置对象,声明式验证
                                rules: [
                                    { required: true, whitespace:true, message: 'Please input your username!' },
                                    { min: 4, message: 'username must be at least 4 characters' },
                                    { max: 12, message: 'username cannot be longer than 12 characters'},
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'username value does not match pattern' }
                                ],
                                initialValue:'admin' // 指定初始值
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username"/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true, message: 'Please input your Password!' }
                                 ],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }

}

/**
 * 包装Form组件生成一个新的组件Form(Login)  传递给子组件Login一个强大的对象form
 */
const WrappedLogin = Form.create({ name: 'normal_login' })(Login);
export default WrappedLogin


/**
 * async & await
 * 作用：简化promise对象的使用，不用再使用then()来指定成功/失败的回调函数
 * 以同步编码方式实现异步流程
 *
 * await 写哪？ 在返回promise的表达式左侧写await，不想要promise对象，想要promise异步成功的value结果
 * async 写哪？ await所在函数（最近的）定义的左侧
 */