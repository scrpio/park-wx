// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',
    hours: '0' + 0,   // 时
    minute: '0' + 0,  // 分
    second: '0' + 0,  // 秒
    order: null,
    garage: null
  },

  initialize: function(startTime) {
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.apiHost + '/api/order?orderId=' + options.orderId,
      success: function (res) {
        var temp = res.data.data
        that.setData({
          order: temp
        })
        that.initialize(temp.startTime)
        that.setInterval()
      }
    })
    wx.request({
      url: app.globalData.apiHost + '/api/garage?id=' + options.garageId,
      success: function (res) {
        that.setData({
          garage: res.data.data
        })
      }
    })
  },
  // 计时器
  setInterval: function () {
    const that = this
    var hours = this.data.hours
    var minute = this.data.minute
    var second = this.data.second
    
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
    }, 1000)
  },
  goPayment() {
    var order = this.data.order
    wx.navigateTo({
      url: '../payment/payment?orderId=' + order.orderId
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