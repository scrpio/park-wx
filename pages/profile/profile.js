// pages/profile/profile.js
const app = getApp()
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    userInfo: {},
    endDate: util.formatDate(new Date()),
    date: util.formatDate(new Date())
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = JSON.parse(options.userInfo)
    var date = userInfo.birthday == undefined ? util.formatDate(new Date()) : userInfo.birthday
    that.setData({
      type: options.type,
      userInfo: userInfo,
      date: date
    })
  },
  formSubmit: function (e) {
    var type = this.data.type
    var userInfo = this.data.userInfo
    var member = e.detail.value
    member.openId = wx.getStorageSync('openId')
    member.avatarUrl = userInfo.avatarUrl
    member.province = userInfo.province
    member.city = userInfo.city
    if (type == 0) {
      //用户信息获取成功 则开始首次用户注册
      wx.request({
        url: app.globalData.apiHost + '/api/member/add', //注册会员
        method: 'POST',
        data: member,
        dataType: 'json',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorageSync('member', res.data.data)
          var pages = getCurrentPages()
          var prevPage = pages[ pages.length - 2]
          prevPage.setData({
            hasUserInfo: true,
            userInfo: res.data.data
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.apiHost + '/api/member/edit', //修改个人信息
        method: 'POST',
        data: member,
        dataType: 'json',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorageSync('member', res.data.data)
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 2]
          prevPage.setData({
            hasUserInfo: true,
            userInfo: res.data.data
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})