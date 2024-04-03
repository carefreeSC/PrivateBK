---
title: node，扫描插件
date: 2022-11-09
tags:
 - node.js
categories:
 -  node.js
---
一、安装依赖
 ```javascript
 npm i node-schedule
```
二、创建一个js文件放置代码
 ```javascript
const schedule = require('node-schedule')
module.exports = ()=>{
    schedule.scheduledJobs('0 0 */1 * * *',async ()=>{
        console.log('每隔一小时执行一次')
    })
}
```
每五分钟：0 * /5 * * * *
每五秒钟：* /5 * * * * * 

三、app.js引入
 ```javascript
require('./util/schedule')()
console.log('[SYSTEM]定时任务开启')
```
四、举例（图书管理系统移动端）
 ```javascript
const schedule = require('node-schedule')
const _t = require('./tools')
const {execSql, selSql, delSql, pageSql, inSql,updateSql,selOne,selAll} = require('../util/mysqlutils')
module.exports = ()=>{
    schedule.scheduleJob('*/10 * * * * *',async ()=>{
        console.log('每隔10s执行一次')
        let borrows = (await pageSql('borrow',{state:_t.enum.BorrowState.borrowing.key})).list
        let curTime = (new Date()).getTime()
        let stepTime = global.overtime * 24 * 60 * 60 * 1000
        let overTimeState = _t.enum.BorrowState.overtimeBorrow.key
        for (let i = 0,l = borrows.length; i<l;i++){
            let borrow = borrows[i]
            console.log('[现时]'+curTime)
            console.log('[借时]'+borrow.borrow_timestamp)
            console.log('[差时]'+stepTime)
            console.log('===========')
            if (curTime - borrow.borrow_timestamp > stepTime){
                await updateSql('borrow',{state:overTimeState},borrow.id)
            }
        }
    })
}
```
五、应用场景
    在遇到需要数据时时更新的情况下，（比如说我们在图书管理系统中，当图书的当前时间减去图书的借阅时间大于你设定的借阅时间时，我们在用户端上的一些按钮就要发生对应得改变）你可以在里面设定多少时间去你的数据库扫描一次。