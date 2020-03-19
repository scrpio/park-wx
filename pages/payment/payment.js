// pages/payment/payment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    timer: '',
    hours: '0' + 0,   // 时
    minute: '0' + 0,  // 分
    second: '0' + 0,  // 秒
    startTime: '',
    price: 0,
    amount: 0,
    payType: 0,
    balance: 0
  },

  initialize: function (startTime) {
    const that = this
    var stime = Date.parse(new Date(startTime))
    var etime = Date.parse(new Date())
    var millis = etime - stime //两个时间戳相差的毫秒数 
    //计算出小时数
    var hours = Math.floor(millis / (3600 * 1000))
    //计算相差分钟数  
    var leave2 = millis % (3600 * 1000) //计算小时数后剩余的毫秒数  
    var minute = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
    var second = Math.round(leave3 / 1000)

    that.setData({
      hours: hours,     // 时
      minute: minute,   // 分
      second: second    // 秒
    })
  },
  setInterval: function () {
    const that = this
    var hours = this.data.hours
    var minute = this.data.minute
    var second = this.data.second
    var price = this.data.price

    that.data.timer = setInterval(function () {  // 设置定时器
      second++
      if (second >= 60) {
        second = 0  //  大于等于60秒归零
        minute++
        if (minute >= 60) {
          minute = 0  //  大于等于60分归零
          hours++
          if (hours < 10) {
            // 少于10补零
            that.setData({
              hours: '0' + hours
            })
          } else {
            that.setData({
              hours: hours
            })
          }
        }
        if (minute < 10) {
          // 少于10补零
          that.setData({
            minute: '0' + minute
          })
        } else {
          that.setData({
            minute: minute
          })
        }
      }
      if (second < 10) {
        // 少于10补零
        that.setData({
          second: '0' + second
        })
      } else {
        that.setData({
          second: second
        })
      }
      var amount = (price * hours).toFixed(2)
      that.setData({
        amount: amount
      })
    }, 1000)
  },
  radioChange: function (e) {
    this.setData({
      payType: e.detail.value
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
    if (this.data.payType == 0) {
      var temp = this.data.order
      var orderInfo = {}
      orderInfo.appid = 'wxe74c03a09601826b'  // 小程序ID
      orderInfo.openid = openId  //用户标识
      orderInfo.mch_id = ''  // 商户号
      orderInfo.nonce_str = ''  // 随机字符串
      orderInfo.sign_type = ''  //签名类型
      orderInfo.sign = ''  // 签名
      orderInfo.body = temp.garageName  // 商品描述
      orderInfo.out_trade_no = temp.orderId  // 商户订单号
      orderInfo.total_fee = this.data.amount  // 标价金额
      orderInfo.spbill_create_ip = '127.0.0.1'  // 终端IP
      orderInfo.notify_url = 'http://localhost:7777/api/wxPay/payResult'  // 通知地址
      orderInfo.trade_type = 'JSAPI'  // 交易类型
      wx.request({
        url: app.globalData.apiHost + '/api/wxPay',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: orderInfo,
        success: function (res) {
          that.requestPayment(res.data)
        }
      })
    }else{
      that.orderEdit()
    }
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
        that.orderEdit()
      },
      'fail': function (res) {
        console.log(res)
      }
    })
  },
  orderEdit(){
    var order = this.data.order
    order.payType = this.data.payType
    order.amount = this.data.amount

    wx.request({
      url: app.globalData.apiHost + '/api/orderEdit',
      method: 'POST',
      data: order,
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.request({
          url: app.globalData.apiHost + '/api/login?openId=' + wx.getStorageSync('openId'),
          success: function (res) {
            var member = res.data.data
            wx.setStorageSync('member', member)
          }
        })

        wx.navigateTo({
          url: '../result/result?orderId=' + order.orderId
        })
      }
    })
  },
  goResult() {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (openId == ''){
      that.payoff()
    }else{
      that.wxPay(openId)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var balance = wx.getStorageSync('member').balance
    wx.request({
      url: app.globalData.apiHost + '/api/order?orderId=' + options.orderId,
      success: function (res) {
        var temp = res.data.data
        that.setData({
          order: temp,
          startTime: temp.startTime,
          price: temp.price,
          balance: balance
        })
        that.initialize(temp.startTime)
        that.setInterval()
      }
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
    clearInterval(this.data.timer)
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