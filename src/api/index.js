/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise对象
 */
import ajax from "./ajax";

// 登录接口
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
// 添加用户接口
export const reqAddUser = (user) => ajax(  '/manage/user/add',user,'POST')
// 请求百度天气接口
export const reqWeather = () => ajax('http://localhost:3000/api1/weather/v1/?district_id=330106&data_type=all&ak=lcMvPAgzXGA9LYRuh7u8PqZnCLB1H31d',"")
// 获取分类的列表
export const reqCategories = (parentId) => ajax('/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (categoryName,parentId) => ajax('/manage/category/add',{categoryName,parentId},'POST')
// 修改分类
export const reqUpdateCategory = (categoryId,categoryName) =>ajax('/manage/category/update',{categoryId,categoryName},'POST')
