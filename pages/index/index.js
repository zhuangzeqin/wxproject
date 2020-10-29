//index.js
import {
  rsaEncrypt,
  validateNumber,
  quickClick,
  isNull,
  showT
} from '../../utils/util.js'
//index页面导入所属的getIndexData.js,在onload函数内调用所属页面的方法
import {
  getBannerData,
  getGanHuo
} from '../../net/index/getIndexData.js'

//获取应用实例
const app = getApp()

Page({
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    // wx.request({
    //   url: 'url',
    // })
    let that = this
    setTimeout(function () {
      that.addBanner()
      wx.hideNavigationBarLoading(); //完成停止加载图标
      wx.stopPullDownRefresh();
    }, 2000)
  },
  data: {
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    //网络请求的banner 的集合数据
    imageDataList: [],
    //是否显示指适点
    indicatorDots: true,
    indicatorcolor: "rgba(134,134,134,1)",
    //是否轮播
    autoplay: true,
    //
    interval: 3000,
    duration: 500,
    inputShowed: false,
    inputVal: "",
    //轮播页当前index
    swiperCurrent: 0,
    baseUrl: app.globalData.baseUrl,
    //菜单服务列表 默认为空
    servers: []
  },


  addBanner: function () {
    const than = this;
    this.setData({
      imgUrls: than.data.imgUrls.concat('https://images.unsplash.com/photo-1551446591-142875a901a1?w=640')
    })

  },

  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //轮播图点击事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent)
  },
  onLoad: function (options) {
    let that = this
    console.log('options', options.key)
    console.log('options', options.key2)
    // let title = wx.getStorageSync('title')
    var title = wx.getStorageSync('title')
    console.log('options', title)
    console.log(app.globalData.item)
    that.getListMenuData()
    //获取banner 数据
    getBannerData().then(res => {
      for (var index in res.data) {
        // that.data.imgUrls[index] = res.data[index].image
        if (index == 0)
          that.data.imgUrls = that.data.imgUrls.concat('https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640')
        else if (index == 1)
          that.data.imgUrls = that.data.imgUrls.concat('https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640')
        else
          that.data.imgUrls = that.data.imgUrls.concat(res.data[index].image)
      }
      that.setData({
        imgUrls: that.data.imgUrls
      })
      //这里就可以对数据进行操作了
    }).catch(err => {
      console.log(err)
    })

    var params = [0,10]

    getGanHuo(params)

    // var http = require('../../utils/httputils');   //相对路径
    // http.getRequest("/banners",
    // function(res) {
     
    // },
    // function(err) {
     
    // })


  },
  /**
   * 当点击Item的时候传递过来
   */
  bindNavigator: function (item) {
    showT(item.currentTarget.dataset.name)
    // wx.navigateTo({
    //   url: e.currentTarget.dataset.path,
    // })
    wx.showLoading({
      title: '正在请求，请稍后',
    })

    var that = this //不要漏了这句，很重要
    wx.request({
      url: 'https://gank.io/api/v2/banners',
      //请求的参数 非必须
      // data: {
      //   x: '',
      //   y: ''
      // },
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        //这里就是请求成功后，进行一些函数操作
        // console.log(res.data.status)
        // console.log(res.data.data)
        console.log(res.data)
        if (res.data.status == 100) {
          // let imageurl = res.data.data[0].image
          for (var index in res.data.data) {
            console.log(res.data.data[index].image)
            if (index == 0)
              that.data.imgUrls = that.data.imgUrls.concat('https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640')
            else if (index == 1)
              that.data.imgUrls = that.data.imgUrls.concat('https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640')
            else
              that.data.imgUrls = that.data.imgUrls.concat(res.data.data[index].image)
            // that.data.imgUrls[index] = res.data.data[index].image
          }
          that.setData({
            imgUrls: that.data.imgUrls
            //res代表success函数的事件对，data是固定的，fengxiang是是上面json数据中fengxiang
          })
        }

      },
      fail: function (ex) {
        console.log(ex)
        wx.hideLoading()
      }
    })

  },
  /**
   * 获取菜单列表
   */
  getListMenuData: function () {
    let baseurl = app.globalData.baseUrl //全局的baserurl 变量
    var listService = [{
        title: '社会',
        items: [{
            name: '捐助',
            url: '/pages/TestPage/TestPage',
            icon: baseurl + '/images/wx/income_wallet@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '京剧',
            url: '',
            icon: baseurl + '/images/wx/income_wallet@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '普及',
            url: '',
            icon: baseurl + '/images/wx/income_wallet@2x.png',
            code: '11'
          }
        ]
      },

      {
        title: '生活',
        items: [{
            name: '微信',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '腾讯',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          }, {
            isBind: true,
            name: '火车票',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '外卖',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '电影',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '水果',
            url: '',
            icon: baseurl + '/images/wx/receiving_service@2x.png',
            code: '11'
          },
        ]
      },
      {
        title: '家庭',
        items: [{
            isBind: true,
            name: '账单',
            url: '',
            icon: '/images/tab_home_sel@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '水费',
            url: '',
            icon: '/images/tab_home_sel@2x.png',
            code: '11'
          },
          {
            isBind: true,
            name: '电费',
            url: '',
            icon: '/images/tab_home_sel@2x.png',
            code: '11'
          }
        ]
      }, {
        title: '其他服务',
        items: [{
          isBind: true,
          name: '税费',
          url: '',
          icon: '/images/tab_home_sel@2x.png',
          code: '11'
        }]
      }
    ]

    this.setData({
      servers: listService
    })
  }


})