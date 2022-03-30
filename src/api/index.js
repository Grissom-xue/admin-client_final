/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise对象
 */
import ajax from "./ajax";

// 登录接口
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
// 添加用户接口
export const reqAddUser = (user) => ajax(  '/manage/user/add',user,'POST')