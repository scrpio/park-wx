const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    money: 0
  },
  bindKeyInput: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  setType: function(e) {
    this.setData({
      type: 0
    })
  },
  selectNum: function(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  //登录
  payoff: function (e) {
    var that = this
    wx.login({
      success: function (res) {
        that.getOpenId(res.code)
      }
    })
  },
  //获取openid
  getOpenId: function (code) {
    var that = this
    wx.request({
      url: app.globalData.apiHost + '/api/getMemberOpenId?code=' + res.code,
      success: function (res) {
        var openId = res.data.openid
        wx.setStorageSync('openId', openId)
        that.wxPay(openId)
      }
    })
  },
  //支付
  wxPay: function (openId) {
    var that = this
    var member = wx.getStorageSync('member')
    var type = this.data.type
    var money = this.data.money
    if (type == 1) {
      money = 50
    } else if (type == 2) {
      money = 100
    } else if (type == 3) {
      money = 200
    } else if (type == 4) {
      money = 300
    } else if (type == 5) {
      money = 500
    } else if (type == 6) {
      money = 1000
    }
    var orderInfo = {}
    orderInfo.appid = ''  // 小程序ID
    orderInfo.openid = openId  //用户标识
    orderInfo.mch_id = ''  // 商户号
    orderInfo.nonce_str = ''  // 随机字符串
    orderInfo.sign_type = ''  //签名类型
    orderInfo.sign = ''  // 签名
    orderInfo.body = member.nickName  // 商品描述
    orderInfo.out_trade_no = ''  // 商户订单号
    orderInfo.total_fee = money  // 标价金额
    orderInfo.spbill_create_ip = '127.0.0.1'  // 终端IP
    orderInfo.notify_url = 'http://localhost:7777/api/wxPay/payResult'  // 通知地址
    orderInfo.trade_type = 'JSAPI'  // 交易类型
    wx.request({
      url: app.globalData.apiHost + '/api/wxPay',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: orderInfo,
      success: function (res) {
        that.requestPayment(res.data)
      }
    })
  },
  //申请支付
  requestPayment: function (obj) {
    var that = this
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        that.setBalance()
      },
      'fail': function (res) {
        console.log(res)
      }
    })
  },
  goPay() {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (openId == '') {
      that.payoff()
    } else {
      that.wxPay(openId)
    }
  },
  setBalance: function(e){
    var recharge = {}
    var member = wx.getStorageSync('member')
    var type = this.data.type
    var money = this.data.money
    if(type==1){
      money = 50
    }else if(type==2){
      money = 100
    } else if (type == 3) {
      money = 200
    } else if (type == 4) {
      money = 300
    } else if (type == 5) {
      money = 500
    } else if (type == 6) {
      money = 1000
    }
    recharge.memberId = member.id
    recharge.nickname = member.nickname
    recharge.money = money
    wx.request({
      url: app.globalData.apiHost + '/api/addRecharge',
      method: 'POST',
      data: recharge,
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.request({
          url: app.globalData.apiHost + '/api/login?openId=' + wx.getStorageSync('openId'),
          success: function (res) {
            var tem = res.data.data
            wx.setStorageSync('member', tem)
          }
        })
        wx.navigateTo({
          url: '../../common/result/result'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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