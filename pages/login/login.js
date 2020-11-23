// pages/login/login.js
import {
  rsaEncrypt,
  validateNumber,
  quickClick,
  isNull,
  showT
} from '../../utils/util.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: "15019437321",
    password: "123",
    mTitle: "",
    mContent: "",
    mCancelText: "",
    mConfirmText: ""
  },
  /**
   *清除手机号码
   */
  clearphone: function () {
    this.setData({
      mobile: ""
    })
  },

  /**
   * 获取手机号输入框内容
   */
  getMobile: function (e) {
    var value = validateNumber(e.detail.value)
    this.setData({
      mobile: value
    })
  },

  /**
   * 获取登录密码输入框内容
   */
  getPassword: function (e) {
    var value = e.detail.value
    this.data.password = value
  },
  /**
   * 登录并绑定  传手机号和密码
   */
  loginbtn: function () {
    if (quickClick()) return

    if (isNull(this.data.mobile)) {
      showT("请输入手机号")
      return
    }
    if (isNull(this.data.password)) {
      showT("请输入登录密码")
      return
    }

    wx.showLoading({
      title: '加载中',
    })
    /**
     * wx.showLoading 和 wx.showToast 同时只能显示一个
       wx.showLoading 应与 wx.hideLoading 配对使用
     */
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    const app = getApp()
    app.globalData.item = '123456'
    wx.setStorageSync('title', "这是我存的title 值")
    // wx.navigateTo({
    //   //路径后可以带参数。参数与路径之间使用 ? 分隔，参数键与参数值用 = 相连，不同参数用 & 分隔；如 'path?key=value&key2=value2'

    //   url: '/pages/index/index?key=zzq&key2=31',

    // })
    wx.switchTab({
      url: '/pages/index/index?key=zzq&key2=31',

    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  showDialog(e) {
    console.log(e)
    this.setData({
      mTitle : e.target.dataset.title,
      mContent : e.target.dataset.content,
      mCancelText : e.target.dataset.canceltext,
      mConfirmText : e.target.dataset.confirmtext
    })
    console.log(this.dialog)
    this.dialog.showDialog();
  },
  //取消事件
  _cancelEvent: function () {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent: function () {
    console.log('你点击了确定');
    this.dialog.hideDialog();
    this.loginbtn();
  },
})