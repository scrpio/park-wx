const app = getApp()
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js')
var qqmapsdk = new QQMapWX({
  key: '73OBZ-CP4WW-ZXURW-RGDFJ-Q5ZYO-6YBWT'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'a0',
    scrollTop: 0,
    scrollH: 1000,
    currentIndex: 0,
    latitude: 23.12463,
    longitude: 113.36199,
    address: '',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getPosition()
    var x = this.data.latitude
    var y = this.data.longitude
    wx.request({
      url: app.globalData.apiHost + '/api/garageList?lat=' + x + '&lng=' + y,
      success: function (res) {
        var markers = res.data.data
        wx.getLocation({
          success: function (res) {
            that.setData({
              markers: markers
            })
          }
        })
      }
    })
  },
  getPosition: function () {
    var that = this
    //腾讯地图获取当前地址
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        var res = res.result
        that.setData({
          address: res.address,
          latitude: res.location.lat,
          longitude: res.location.lng,
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  changeView: function (ev) {//地图，列表切换
    this.setData({
      currentIndex: ev.target.dataset.index
    })
  },
  upper: function (e) {},
  lower: function (e) {},
  scroll: function (e) {},
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
  goDetail(e) {
    var item = e.currentTarget.dataset.bean
    wx.navigateTo({
      url: '../../park/detail/detail?id=' + item.id + "&distance=" + item.distance
    })
    
  },
  goDestination(e) {
    var item = e.currentTarget.dataset.bean
    let plugin = requirePlugin('routePlan');
    let key = '73OBZ-CP4WW-ZXURW-RGDFJ-Q5ZYO-6YBWT';
    let referer = '立体停车库-客户端';
    let endPoint = JSON.stringify({
      'name': item.title,
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