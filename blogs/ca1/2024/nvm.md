---
title: 关于nvm控制node版本的下载使用
date: 2024-03-06
sidebar: {
      "/docs/theme-reco/": [
        "",
        "api"
      ]
    }
tags:
 - node.js
categories:
 -  node.js
---
前言：由于之前用到的node版本单一或只用到两个版本，个人都是直接选择去官网下载对应的安装包进行install，但随着构建了新的项目，有时运行以往项目时，手动切换node版本变得十分麻烦。使用nvm能够快速下载、切换项目需要的node版本及对应的npm。详细安装如下（因为op使用的是windows，所以这边以windows为例）:
## nvm-windows安装
​
各系统安装教程：使用 nvm 管理不同版本的 node 与 npm | 菜鸟教程
安装前：记得卸载已有的node，防止发生冲突
安装包：链接：https://pan.baidu.com/s/1nZ5XXIAaPTVU_NuRUBvyIA 提取码：care
点击nvm-setup.exe,选择安装路径下载
![F12](https://img-blog.csdnimg.cn/direct/d8c498049b704da0a428e86d83f3210b.png)
下载完成后，打开命令提示符，查看是否安装成功
![F12](https://img-blog.csdnimg.cn/direct/e0fa2add10bf48ad9fe020fbf81f0b9e.png)

## nvm常用命令
nvm install x.x.x //下载node，版本号为X.X.X
nvm use X.X.X //切换到指定版本的node
nvm ls //查看已安装的实例

## 关于npm初始化
​
1.最近进行复习的时候，下载node.js后，想在对应文件夹执行npm i，报错无法执行（-4058）.
![F12](https://img-blog.csdnimg.cn/direct/6a6632493ef24b4a92702184fe2febee.png)
排查后，发现忘记需要先初始化：npm init,然后在执行npm i.

​