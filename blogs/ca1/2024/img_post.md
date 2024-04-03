---
title: 图片上传问题
date: 2022-11-09
tags:
 - axios
 - file
categories:
 -  前端
---
 近日在练手项目的时候，遇到一个问题。在图书管理系统中上传一本图书的封面图片，我使用element ui 的upload，直接使用axios来post上传，这时后台会一直一直显示文件上传失败。
 Err原因：图片的数据需要通过formdata转换，再将它作为data，post上传
 后台文件代码（fileutil）:
  ```javascript
 // 文件工具类
const fs = require("fs");
const formidable = require("formidable");

const path = require('path')
// 递归创建目录 同步方法
let mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

module.exports = {
    /**
     * 上传文件
     * @param req
     * @param options 配置formidable和文件路径的相关参数
     *  eg:{
     *      fileDir:"public/file", 文件存放路径 相对于被引用的位置的相对位置，也可以使用绝对路径, 要求public目录要手动创建好
     *      maxFileSize :2 * 1024 * 1024， 文件最大的大小(指的是一次上传总的、多个的文件的大小) 单位B
     *  }
     */
    upload: (req, options) => {
        if (!options) {
            options = {};
        }
        // 文件存放目录  该目录是以被引用的位置作为相对位置。
        let cacheFolder = options.fileDir ? options.fileDir : 'public/file';
        if(!fs.existsSync(cacheFolder)){
            fs.mkdirSync(cacheFolder)
        }
        // mkdirsSync(cacheFolder)
        let form = new formidable.IncomingForm(); //创建上传表单
        form.encoding = 'utf-8'; //设置编辑
        form.uploadDir = cacheFolder; //设置上传目录
        form.keepExtensions = true; //保留后缀
        form.maxFileSize = options.maxFileSize ? options.maxFileSize : 2 * 1024 * 1024; //文件大小
        form.type = true;
        form.multiples =  true;
        return new Promise((resolve) => {
            form.parse(req, async (err, fields, files) => {
                if(err) {
                    console.log(`文件上传异常：${err.message}`)
                    throw err
                }
                let list = []
                for(let file in files){
                    let tmp = files[file]
                    list.push({path:tmp.path,name:tmp.name})
                }
                console.log(`文件上传成功${JSON.stringify(list)}`)
                resolve({fields,list})
            })
        })
    }
}
 ```
后台接口：
  ```javascript
  router.post('/add', async (req, res) => {
    console.log('[req:]'+req)
    let {list,fields} = await upload(req)
    // res.send(list + 'and' + fields)
    if (!list || list.length == 0) {
        throw new Error('请设置封面！！！')
    }
        fields.id = _t.id()
        fields.create_time = _t.moment.format('YYYY-MM-DD HH:mm')
        fields.img = list[0].path
        await inSql('book', fields);
        res.send()

})
   ```
   前端formdata的封装：
```javascript
     postWithFile:(url,fileList)=>{
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
    return formData//将这个返回的数据作为data传参
}
```
同时有一个需要注意的点：

获取图片时记得读取文件，onchange为element自带的属性
```javascript
onchange(file, fileList) {
    this.fileList = fileList
    // 读取文件
    let _this = this
    let reader = new FileReader()
    reader.onload = function () {
        _this.url = this.result
    }
    reader.readAsDataURL(this.fileList[0].raw)
// readAsText() 读取文本文件，(可以使用Txt打开的文件)
// readAsBinaryString(): 读取任意类型的文件，返回二进制字符串
// readAsDataURL: 方法可以将读取到的文件编码成DataURL ，可以将资料(例如图片)内嵌在网页之中，不用放到外部文件
// abort: 中断读取
},
```
![](https://img-blog.csdnimg.cn/3bd2732b3d9847e4909d2028a8893a37.png)