---
title: jwt的使用
date: 2022-11-09
tags:
 - node.js
categories:
 -  node.js
---
这一篇文章是用来解决登录的验证，以及没有登录的情况下直接访问后面页面的拦截。

一、下载jwt
```javascript
npm install jsonwebtoken
```
注意：在下载相关的插件时，要先ctrl + c 退出,在下载

二、jwt相关文件的创建

在服务端文件创建util，专门用来存放需要用到相关插件代码

jwtutils.js
```javascript
// 安全拦截器
const jwt = require("jsonwebtoken");
 
/**
 * 验证权限
 * @param token
 * @param secretkey 秘钥
 * @param success
 * @param error
 */
function verify(token, secretkey) {
    console.log(token)
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretkey, function (err, decode) {
            if (err) {
                console.log('[verifyErr]')
                reject(err);
            } else {
                resolve(decode);
            }
        })
    }).catch(e =>{
        console.log('[verifyCatchErr]')
        console.error(e)
        throw new Error('令牌已过期')
    })
}
 
/**
 * 签名
 * @param load 载荷 json对象 存储存在
 * @param secretkey 秘钥
 * @param expiresIn 过期时间 秒
 * @returns {number | PromiseLike<ArrayBuffer>}
 */
function sign(load, secretkey, expiresIn) {
    var token = jwt.sign(load, secretkey, {expiresIn: expiresIn});
    return token;
}
 
module.exports = {verify, sign};
```
三、下载数据库mysql

npm install mysql

直接在里面对sql操作进行封装，然后export，可以更加便捷的去使用。

host、user、password、port填写自己电脑相对应的信息

database是你要连接的数据库名

引入之后，可以进入对应的文件夹，编写对应代码（比如console.log(selAll('user'))）在命令提示符输入 node mysqlutils.js 来测试是否成功连接。

mysqlutils.js

```javascript
// 操作数据库模块
const mysql = require('mysql');
const logPrefix = '[Mysql]'
 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'child_terrace'
});
/**
 * 增删改查 通用组件  同步写法
 *
 * @param sql 增删改查sql 含占位符
 */
let execSql = function (sql) {
 
    var params = [];
    if (arguments.length > 1) {
        //js中有个变量arguments,可以访问所有传入的值
        for (var i = 1, l = arguments.length; i < l; i++) {
            params.push(arguments[i]);
        }
    }
 
    console.log(`[mysql] 参数: ${params.join()}`)
    console.log(`[mysql] 参数: ${sql}`)
 
    // 返回一个 Promise
 
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, params, (err, results) => {
//在数据库里头所有的查询都用connection.xxxx0
                        if (err) {
                            reject(err)
                        } else {
                            console.log(`${logPrefix}result : ${JSON.stringify(results)}`);
                            resolve(results)
                        }
                        // 结束会话
                        connection.release()
                    })
                }
            })
        }).catch(err=>{
            throw err
        })
 
}
/*
* 查询
* */
let selSql = async (table, id) => {
    let tmp = await execSql(`select * from ${table} where id= ?`, id)
    if (tmp) {
        return tmp[0]
    } else {
        return null
    }
}
 
/*
* 删除
* */
let delSql = (table, id) => {
    return execSql(`delete from ${table} where id = ?`, id)
}
 
/*
* 添加\插入
* */
let inSql = (table, params) => {
    if (params) {
        let ks = []
        let vs = []
        let is = []
        for (let k in params) {
            ks.push(k)
            vs.push('?')
            is.push(params[k])
        }
        return execSql(`insert into ${table}(${ks.join()}) value(${vs.join()})`, ...is)
    } else {
        throw new Error('参数为空！！！')
    }
}
/*
* 分页
* */
let pageSql =async (table, where = {}, pageNo, pageSize) => {
    // console.log(where)
    let ws = [];
    let vs = [];
    for (let k in where) {
        let v = where[k];
        if (!v)
            continue
        if (['string','number'].includes(typeof v)) {
            vs.push(v)
            ws.push(` and ${k} = ?`)
        }else if (v.length == 2){
            let v0 = v[0];
            let v1 = v[1];
            if (v1 == 'in'){
                vs.push(...v0);
                let ps = [];
                for (let i = 0,l = v0.length;i<l;i++){
                    ps.push('?')
                }
                ws.push(`and ${k} in (${ps.join()})`)
            } else {
                vs.push(v[0]);
                ws.push(` and ${k} ${v1} ?`)
            }
        } else if (v.length == 3){
            let v0 = v[0];
            let v1 = v[1];
            let v2 = v[2];
            if (!v0){
                continue
            }
            if (v2 == 'left'){
                ws.push(`and ${k} like '%${v0}'`)
            } else if (v2 == 'right'){
                ws.push(`and ${k} like '${v0}%'`)
            } else if(v2 == 'both'){
                ws.push(`and ${k} like '%${v0}%'`)
            }else {
                throw new Error('未知参数格式！！！')
            }
        }else {
            throw new Error('未知参数格式！！！')
        }
    }
 
    let limit = '';
    let ls = [];
    if (pageNo && pageSize) {
        limit = `limit ?, ?`;
        ls.push((parseInt(pageNo) - 1) * parseInt(pageSize));
        ls.push(parseInt(pageSize))
    }
    let list = await execSql(`select * from ${table} where 1 = 1 ${ws.join('')} ${limit}`, ...vs, ...ls);
    let total = await execSql(`select count(1) as count from ${table} where 1 = 1 ${ws.join('')}`, ...vs);
    total = total[0].count;
    return {
        list,total
    }
};
 
/*
* 修改
* */
 
let updateSql =async (table,params={},id)=>{
    let ks = []
    let vs = []
    for (let k in params){
        ks.push(`${k} = ?`)
        vs.push(params[k])
    }
    return await execSql(`update ${table} set ${ks.join()} where id = ?`,...vs,id)
}
 
 
/*
* 单独查询
* */
let selOne = async (table,where)=>{
    let {list} = await pageSql(table,where)
 
    if (list && list.length > 0){
        return list[0]
    } else {
        console.log('123')
        return null
    }
}
/*
* 查询全部
* */
let selAll = (table)=>{
    return execSql(`select * from ${table}`)
 
}
/*
* 批量删除
* */
let delSqlBench = (table, ids) => {
    if (!ids || ids.length == 0) {
        return
    }
    let ps = []
    for (let i = 0, l = ids.length; i < l; i++) {
        ps.push('?')
    }
    return execSql(`delete from ${table} where id in (${ps.join()})`, ...ids)
}
 
module.exports = {execSql,selSql,delSql,pageSql,inSql,updateSql,selOne,selAll,delSqlBench};
```