const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'a0',
    scrollTop: 0,
    scrollH: 1142,
    currentIndex: 2,
    billList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var member = wx.getStorageSync('member')
    wx.request({
      url: app.globalData.apiHost + '/api/orderList?memberId=' + member.id + '&type=' + 2,
      success: function (res) {
        var list = res.data.data
        for (var i = 0; list != null && i < list.length; i++) {
          if (list[i].endTime == null) {
            list[i].duration = that.getDuration(list[i].startTime, new Date())
          } else {
            list[i].duration = that.getDuration(list[i].startTime, list[i].endTime)
          }
        }
        that.setData({
          orderList: list
        })
      }
    })
  },
  upper: function (e) { },
  lower: function (e) { },
  scroll: function (e) { },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  changeBtn: function (ev) {//列表切换
    this.setData({
      currentIndex: ev.target.dataset.index
    })
  },
  goDetail: function (e) {
    var order = e.currentTarget.dataset.bean
    if (order.status == 0) {
      wx.navigateTo({
        url: '../park/order/order?orderId=' + order.orderId + '&garageId=' + order.garageId
      })
    } else {
      wx.navigateTo({
        url: '../park/detail/detail?orderId=' + order.orderId
      })
    }
  },
  getOrderList: function (e) {
    var that = this
    var member = wx.getStorageSync('member')
    wx.request({
      url: app.globalData.apiHost + '/api/orderList?memberId=' + member.id + '&type=' + e.currentTarget.dataset.index,
      success: function (res) {
        var list = res.data.data
        for (var i = 0; list != null && i < list.length; i++) {
          if (list[i].endTime == null) {
            list[i].duration = that.getDuration(list[i].startTime, new Date())
          } else {
            list[i].duration = that.getDuration(list[i].startTime, list[i].endTime)
          }
        }
        that.setData({
          orderList: list
        })
      }
    })
  },
  getDuration: function (startTime, endTime) {
    var stime = Date.parse(new Date(startTime))
    var etime = Date.parse(new Date(endTime))
    var millis = etime - stime //两个时间戳相差的毫秒数
    var hours = millis / (1000 * 60 * 60)

    return hours.toFixed(1)
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