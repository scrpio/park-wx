// pages/garage/garage.js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
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
    count: 0,
    markers: [],
    markerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var sysinfo = wx.getSystemInfoSync().windowHeight
    let offsetS = 120
    //兼容iphoe5滚动
    if (sysinfo < 550) {
      offsetS = -40
    }
    //兼容iphoe Plus滚动
    if (sysinfo > 650 && sysinfo < 700) {
      offsetS = 240
    }
    //腾讯地图获取当前地址
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        console.log(res)
        var res = res.result
        that.setData({
          address: res.address
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
    wx.request({
      url: app.globalData.apiHost + '/api/garageList',
      success: function (res) {
        var markers = res.data.data
        var temp = res.data.data
        var list = []
        var count = 0
        wx.getLocation({
          success: function (res) {
            var x = res.latitude
            var y = res.longitude
            for (var i = 0; i < temp.length; i++) {
              var d = that.getDistance(x, y, temp[i].latitude, temp[i].longitude)
              markers[i].iconPath = '../../image/mark.png'
              markers[i].height = 25
              if (d < 10000) {
                temp[i].distance = d
                list[count] = temp[i]
                count++
              }
            }
            that.setData({
              latitude: x,
              longitude: y,
              count: count,
              markers: markers,
              markerList: list
            })
          }
        })
      }
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;

    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

  },
  changeView: function (ev) {//地图，列表切换
    this.setData({
      currentIndex: ev.target.dataset.index
    })
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
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
  confirmBtn(e) {
    wx.request({
      url: app.globalData.apiHost + '/api/getOrderByStatus?status=0',
      success: function (res) {
        var order = res.data.data
        if (order != null) {
          wx.showModal({
            title: '提示',
            content: '您的车已停在车库中，是否取车！',
            success: function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../order/order?orderId=' + order.orderId + '&garageId=' + order.garageId
                })
              }
            }
          })
        } else {
          var item = e.currentTarget.dataset.bean
          wx.navigateTo({
            url: '../park/park?id=' + item.id + "&distance=" + item.distance
          })
        }
      }
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