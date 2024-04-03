---
title: 前端关于普通数组与对象数组的查询方法
date: 2023-11-09
tags:
 - array
categories:
 -  前端
---
1.JSON数组去重方法封装
 ```javascript
 tools.delRepeatJson = function(arr = [], attrName = '') {
    var temp = {}; //用于name判断重复
    var result = []; //最后的新数组
 
    arr.forEach(function (item, index) {
        if (!temp[item[attrName]]) {
            result.push(item);
            temp[item[attrName]] = true;
        }
    });
    return result;
}
//arr为要查重的json数组
//attrName为要按那个属性去查重
  ```
2.数组合并使用的是.concat
使用方法：假设有两个数组arr1\arr2想要合并这两个数组
let arr3 = arr1.concat(arr2)

3.遍历数组法
实现思路：新建一个数组，遍历去要重的数组，当值不在新数组的时候（indexOf为-1）就加入该新数组中。

indexOf的定义与用法

indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。

如果没有找到匹配的字符串则返回 -1。

注意： indexOf() 方法区分大小写。

提示： 同样你可以查看类似方法 lastIndexOf() 。
 ```javascript
var arr=[2,8,5,0,5,3,3,3,8];
function unique1(arr) {
    var hash = [];
    for (var i=0; i<arr.length; i++) {
        if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
        }
    }
    return hash;
}
  ```
  4.数组下标判断法
实现思路：如果当前数组的第 i 项在当前数组中第一次出现的位置不是 i，那么表示第 i 项是重复的，忽略掉。否则存入结果数组。
 ```javascript
 function unique2(arr) {
    var hash = [];
    for (var i=0; i<arr.length; i++) {
        if (arr.indexOf(arr[i]) == i) {
            hash.push(arr[i]);
        }
    }
    return hash;
}
  ```
  5.排序后相邻去除法 
实现思路：给传入的数组排序，排序后相同的值会相邻，然后遍历排序后数组时，新数组只加入不与前一值重复的值。
 ```javascript
 
function unique3(arr) {
    arr.sort();
    var hash = [arr[0]];
    for (var i=1; i<arr.length; i++) {
        if (arr[i] != hash[hash.length-1]) {
            hash.push(arr[i]);
        }
    }
    return hash;
}
  ```
  6.优化遍历数组法（推荐）
实现思路：双层循环，外循环表示从0到arr.length,内循环表示从i+1到arr.length

将没重复的右边值放入新数组。（检测到有重复值时终止当前循环同时进入外层循环的下一轮判断）
 ```javascript
function unique4(arr) {
    var hash = [];
    for (var i=0; i<arr.length; i++) {
        for (var j=i+1; j<arr.length; j++) {
            if (arr[i] === arr[j]) {
                ++i;
            }
        }
        hash.push(arr[i]);
    }
    return hash;
}
  ```
  7.es6实现
基本思路：ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set函数可以接收一个数组(或类似数组的对象)作为参数，用来初始化。

如果重复，则去掉该元素

数组下标去重
 ```javascript
//es6实现
function unique5(arr) {
    var x = new Set(arr);
    return [...x];
}
 
 
//扩展
 
function unique22(arr) {
    var hash=[];
    for (var i=0; i<arr.length; i++) {
        if (arr.indexOf(arr[i]) == arr.lastIndexOf(arr[i])) {
            hash.push(arr[i]);
        }
    }
    return hash;
}
  ```