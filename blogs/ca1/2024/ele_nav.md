---
title: element ui导航栏跳转问题
date: 2022-11-09
tags:
 - element ui
categories:
 -  前端
---
问题：点击其它导航，然后刷新页面，会发现导航栏刷新了回复到了默认。但是router-view(下面展现的内容)没有跟随改变。
一、解决办法
```javascript
 <!-- 菜单栏 -->
          <div class="top">
                  <el-menu
                  :router="true"
                  :default-active="ActiveIndex"
                  class="el-menu-demo"
                  mode="horizontal"
                  @select="handleSelect"
                  background-color="#545c64"
                  text-color="#fff"
                  active-text-color="#ffd04b">
```
elementui导航栏有一个select
![](https://img-blog.csdnimg.cn/680425fd761342148214f5f79ba75d6d.png)
 1.解决思路：可以在代码中绑定一个事件函数，在函数方法中传入index参数，并且使用localStorage存储index，接着在生命周期函数created中把index赋值
```javascript
 handleSelect(key,keyPath){
      console.log(key,keyPath);
      //存储index的值
      localStorage.setItem("index", key);
    },
 
 
 
 
 
created() {
    //生命周期获取index并赋值
    let index = localStorage.getItem("index");
    if (index) {
      this.ActiveIndex = index;
    }
  },
```
2.解决思路：直接在el-menu给default-active绑定$route.path就可以快速实现        :default-active="$route.path"。