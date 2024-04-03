module.exports = {
  "title": "carefree 的技术博客",
  "description": "boke",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    valineConfig:{
      appId:"3o8ThJKFSMhQuX5y2kEbPb6p-gzGzoHsz",
      appKey:"siSyirnvIcw18cQcJ28MKZms",
    },
    "nav": [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "文档",
        "icon": "reco-message",
        "items": [
          {
            "text": "随手记",
            "link": "/docs/theme-reco/"
          }
        ]
      },
      {
        "text": "联系方式",
        "link": "/docs/concat",
        "icon": "reco-message"
      }
    ],
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "专栏"
      },
    },
    "friendLink": [
      {
        "title": "午后南杂",
        "desc": "Enjoy when you can, and endure when you must.",
        "email": "1156743527@qq.com",
        "link": "https://www.recoluan.com"
      },
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "https://img95.699pic.com/xsj/05/lb/iz.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "carefree（ZSC）",
    "authorAvatar": "https://ss0.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3215447402,2310101162&fm=253&gp=0.jpg",
    "startYear": "2021"
  },
  "markdown": {
    "lineNumbers": true
  },
}