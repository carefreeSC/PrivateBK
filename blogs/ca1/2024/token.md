---
title: promis参数顺序
date: 2022-11-09
tags:
 - promise
categories:
 -  前端
---
问题出在verify的promise

promise参数的位置是固定的
 ```javascript
return new Promise((resolve, reject) => {}
 ```
错误写法：
 ```javascript
return new Promise((reject，resolve) => {}
 ```