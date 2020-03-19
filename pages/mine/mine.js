// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo==null) {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
      }
    }
    if (wx.getStorageSync('member')==null) {
      wx.request({
        url: app.globalData.apiHost + '/api/login?openId=' + wx.getStorageSync('openId'),
        success: function (res) {
          var member = res.data.data
          if (member == null) {
            that.setData({
              hasUserInfo: false
            })
          } else {
            that.setData({
              hasUserInfo: true,
              userInfo: member
            })
            wx.setStorageSync('member', member)
          }
        }
      })
    }else{
      that.setData({
        hasUserInfo: true,
        userInfo: wx.getStorageSync('member')
      })
    }
  },
  goRegister: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    
    var userInfo = JSON.stringify(e.detail.userInfo)
    wx.navigateTo({
      url: '../profile/profile?type=0&userInfo=' + userInfo
    })
  },
  goProfile: function (e) {
    var userInfo = JSON.stringify(this.data.userInfo)
    wx.navigateTo({
      url: '../profile/profile?type=1&userInfo=' + userInfo
    })
  },
  goRecord: function (e) {
    wx.navigateTo({
      url: '../record/record'
    })
  },
  goRecharge: function (e) {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
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

  // getPhoneNumber: function (e) {
  //   var that = this
  //   var user = this.data.userInfo
  //   wx.request({
  //     url: app.globalData.apiHost + '/api/getPhoneNumber', //获取手机号
  //     method: 'POST',
  //     data: {
  //       "encryptedData": e.detail.encryptedData,
  //       "iv": e.detail.iv,
  //       "session": wx.getStorageSync('session_key'),
  //     },
  //     dataType: 'json',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       user.phone = res.data
  //       var userInfo = JSON.stringify(user)
  //     }
  //   })
  // }
})