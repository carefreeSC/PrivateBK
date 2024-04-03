---
title: sql语法封装、node.js连接数据库
date: 2022-11-09
tags:
 - sql
 - node.js
categories:
 -  node.js
---

一、连接数据库
'''javascript
const mysql = require('mysql');
const logPrefix = '[Mysql]'
 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: '0806_library'
});
'''
二、封装sql
 ```javascript
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
//在数据库里头所有的查询都用connection.xxxx
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
            // let z = [1,2]
            // console.log('z+'+z)
            // console.log('z0+'+z[0])
            // console.log('v:'+v)
            // console.log('v3:'+v[3])
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
 
    // console.log('vs'+vs)
    //
    // console.log('ws'+ws)
    let limit = '';
    let ls = [];
    if (pageNo && pageSize) {
        limit = `limit ?, ?`;
        ls.push((parseInt(pageNo) - 1) * parseInt(pageSize));
        ls.push(parseInt(pageSize))
    }
    // console.log('ls'+ls)
    let list = await execSql(`select * from ${table} where 1 = 1 ${ws.join('')} ${limit}`, ...vs, ...ls);
    let total = await execSql(`select count(1) as count from ${table} where 1 = 1 ${ws.join('')}`, ...vs);
    total = total[0].count;
    // console.log(list)
    // console.log(total);
    return {
        list,total
    }
};
// pageSql('user',{type:[[0,1],'in']},1,2)
// pageSql('notice',{title:['zsc','like','both'],type:0}, 1, 3)
 
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
 
// console.log(execSql('select a.*, b.name as type from book a left join booktype b on a.type = b.name where a.id = ?','a1b9c670-18d9-11ed-b699-4d08e085cb08'))
// console.log(execSql('select a.*, b.book_id as id from book a left join borrow b on a.id = b.book_id where a.id = ?','8defddf0-1ed8-11ed-bf43-01158d1ed2d8'))
module.exports = {execSql,selSql,delSql,pageSql,inSql,updateSql,selOne,selAll,delSqlBench};
 ```
三、sql常用语句及分析

1.查询语句
 ```javascript
select * from 表名 where 属性 = ?
 ```
2.插入语句
 ```javascript
insert into 表名 (属性，属性，属性) value (?,?,?)
 ```
3.修改语句
 ```javascript
update 表名 set 属性，属性，属性 where 属性 = ？
 ```
4.删除语句
 ```javascript
delete from 表名 where id  = ?
 ```
批量删除
 ```javascript
delete from 表名 where id in ()
 ```
5.表关联语句

一、外连接

1.左连接 left join 或 left outer join

SQL语句：select * from student left join score on student.Num=score.Stu_id;

2.右连接 right join 或 right outer join

SQL语句：select * from student right join score on student.Num=score.Stu_id;

3.完全外连接 full join 或 full outer join

SQL语句：select * from student full join score on student.Num=score.Stu_id;

通过上面这三种方法就可以把不同的表连接到一起，变成一张大表，之后的查询操作就简单一些了。

而对于select * from student,score;则尽量不使用此语句，产生的结果过于繁琐。

二、内连接

join 或 inner join

SQL语句：
 ```javascript
select * from student inner join score on student.Num=score.Stu_id;
 ```
此时的语句就相当于：
 ```javascript
select * from student,score where student.ID=course.ID;
 ```
三、交叉连接

cross join，没有where指定查询条件的子句的交叉联接将产生两表的笛卡尔积。

SQL语句：
 ```javascript
select * from student cross join score;
 ```
四、结构不同的表连接

当两表为多对多关系的时候，我们需要建立一个中间表student_score，中间表至少要有两表的主键。

SQL语句：
 ```javascript
select s.Name,C.Cname from student_score as sc left join student as s on s.Sno=sc.Sno left join score as c on c.Cno=sc.Cno

select C_name,grade from student left join score on student.Num=score.Stu_id where name=‘李五一’;
 ```
红色部分即中间表，是集合两表所有内容的一张总表。

五、UNION操作符用于合并两个或多个select语句的结果集。

UNION内部的SELECT语句必须拥有相同数量的列，每个列也必须拥有相似的数据类型，每条SELECT语句中的列的顺序必须相同。
 ```javascript
select Num from student union select Stu_id from score;
 ```
union操作符是默认查重的，如果允许重复的值，就可以使用union all 。对于两张结构相同的表，union也可以把他们合并成一张表：
 ```javascript
select * from student1 union select *from student2;

select a.*, b.book_id as id from book a left join borrow b on a.id = b.book_id where a.id = ?
 ```
6.查询一条语句
 ```javascript
select * from borrow where book_id = ? order by borrow_date desc limit 1
 ```
7.模糊查询语句
 ```javascript
SELECT 字段 FROM 表 WHERE 某字段 LIKE 条件;
```
8.建表语句
 ```javascript
create table 表名
 ```
————————————————
                        
原文链接：https://blog.csdn.net/weixin_64463374/article/details/126445853
