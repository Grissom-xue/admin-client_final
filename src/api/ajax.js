/**
 * 能发送异步Ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是一个promise对象
 *
 * 优化点：
 * 1. 统一处理请求异常(外层包一个自己创建的promise对象，而且报错的时候不去执行reject 而是调用组件去提示错误信息)
 * 2. 异步得到的不是response 而是response.data
 */
import axios from 'axios'
import {message} from "antd";
export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject) => {
        let promise;
        //1. 执行异步请求
        if (type==='GET'){
            promise =  axios.get(url,{
                params:data
            })
        }else {
            console.log('post request')
            promise =  axios.post(url,data)
        }
        //2. 如果成功调用resolve(value),value就是返回给上层的结果
        promise.then(response=>{
            resolve(response.data)
        }).catch(error=>{//3. 如果失败 不调动reject(reason) 而是提示异常信息
            message.error('请求出错：' + error.message)
        })

    })

}

// ajax('login',{username:'admin',password:'admin'},'POST').then()