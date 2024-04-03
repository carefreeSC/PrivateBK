---
title: jsonp的封装
date: 2022-11-09
tags:
 - jsonp
categories:
 -  前端
---
这是解决跨域问题的前端办法之一。

核心思想：网页通过添加一个script元素，向服务器请求Json数据，服务器收到请求后，将数据放在一个指定名字的回调函数的参数位置传回来
 ```javascript
 var future = {}
    // 函数命名规则
future.id = function() {
    let start = '_abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let end = start + '0123456789'
    let id = ''
    for (let i = 0; i < 8; i++) {
        if (i = 0) {
            id += start.charAt(Math.floor(Math.random() * start.length))
        } else {
            id += end.charAt(Math.floor(Math.random() * end.length))
        }
    }
    return id
}
future.jsonp = function({ url, params, callback }) {
    let id = this.id()
    params || (params = {})
        //将客户端的aqi当作一个参数传递到服务端
    params.callback = id
 
 
    //一个url不可能有两个问号
    for (let key in params) {
        if (url.indexOf('?') != -1) {
            url += `&${key}=${value}`
        } else {
            url += `?${key}=${value}`
        }
    }
 
 
    //发起前api的构建
    let _z = function() {
        try {
            if (callback) {
                callback(result)
            }
        } catch {
            console.error(e);
        }
        //善后
        let script = document.getElementById(id)
        script.parentNode.removeChild(script)
 
        eval(`${id} = null`)
    }
 
    //动态构建
    eval(`${id} = function(result){_z(result)}`)
 
 
    //真正发起请求
    let script = document.createElement('script')
    script.src = url
    script.setAttribute('id', id)
    document.body.appendChild(script)
}
  ```