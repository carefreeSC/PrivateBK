---
title: axios的封装
date: 2022-11-09
tags:
 - axios
categories:
 -  前端
---
 ```javascript
import axios from 'axios'
const baseUrl = 'http://localhost:3000'

let execute = option => {
    let headers = option.headers
    headers || (headers = {})
    headers.token = window.vm.$t.getToken()
    let method = option.method || 'post'
    method = method.toLocaleLowerCase()
    return new Promise((resolve,reject)=>{
        axios({
            headers:headers,
            url: option.url,
            method: option.method,
            data:  option.data,
            params: option.params
        }).then(({data}) => {
            resolve(data)
        }).catch(e => {
            console.log(e)
            console.log(1111)
            reject(e)
        })
    }).catch(e=>{
        console.log(e)
        console.log(2222)
        let info
        if (e.response){
            info = e.response.data
        }
        info || (info = '请求异常')
        window.vm.$message.error(info)
        if (info == '令牌已过期'){
            this.$router.push('/login')
            window.vm.$message.error(info)
            return
        }
        console.error(e)
        throw e
    })
}
const $axios = {
    post: (url, data, headers) => {
        return execute({
            url,
            data,
            headers,
            method: 'post'
        })
    },
    get: (url, params, headers) => {
        return execute({
            url,
            params,
            headers,
            method: 'get'
        })
    },
    postWithFile:(url,data,fileList,headers)=>{
        let formData = new FormData()
        if (fileList){
            fileList.forEach((item,index)=>{
                formData.append('file' + index, item)
            })
        }

        if (data){
            for(let key in data){
                formData.append(key,data[key])
            }
        }
        return execute({
            url,
            data:formData,
            headers:{'Content-Type':'multipart/form-data',...headers},
            method:'post'
        })
    }
}


export default $axios
export {baseUrl}
 ```
————————————————

                            注：原本都将技术文章发布到CSDN上面，有兴趣可以链接访问：
                        
原文链接：https://blog.csdn.net/weixin_64463374/article/details/126325959