const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkInfo: null,
    distance: 0,
    //轮播图
    imgUrls: [
      '../../../image/detail_1.png',
      '../../../image/detail_2.png',
      '../../../image/detail_3.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.apiHost + '/api/garage?id=' + options.id,
      success: function (res) {
        that.setData({
          parkInfo: res.data.data,
          distance: options.distance
        })
      }
    })
  },
  changeConfirm() {
    var member = wx.getStorageSync('member')
    if (member == null || member == '') {
      wx.showModal({
        title: '提示',
        content: '您还未登录，是否前往登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../tabBar/mine/mine'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      var parkTemp = this.data.parkInfo
      var member = wx.getStorageSync('member')
      wx.request({
        url: app.globalData.apiHost + '/api/getOrderByStatus?memberId=' + member.id,
        success: function (res) {
          var orderData = res.data.data
          if (orderData != null) {
            wx.navigateTo({
              url: '../order/order?orderId=' + orderData.orderId + '&garageId=' + orderData.garageId
            })
          } else {
            var order = {}
            order.memberId = member.id
            order.nickname = member.nickname
            order.license = member.license
            order.garageId = parkTemp.id
            order.garageName = parkTemp.name
            order.price = parkTemp.price
            console.log(order)
            wx.request({
              url: app.globalData.apiHost + '/api/orderAdd',
              method: 'POST',
              data: order,
              dataType: 'json',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                var order = res.data.data
                wx.navigateTo({
                  url: '../order/order?orderId=' + order.orderId + '&garageId=' + order.garageId
                })
              }
            })
          }
        }
      })

    }
  },
  goDestination(e) {
    var item = e.currentTarget.dataset.bean
    let plugin = requirePlugin('routePlan');
    let key = '';
    let referer = '立体停车库-客户端';
    let endPoint = JSON.stringify({
      'name': item.name,
      'latitude': item.latitude,
      'longitude': item.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
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
})