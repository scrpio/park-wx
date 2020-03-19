
const app = getApp()
Page({
  data: {
    //轮播图
    imgUrls: [
      '../../image/banner.png',
      '../../image/banner_1.png',
      '../../image/banner_2.png',
      '../../image/banner_3.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500
  },
  onLoad: function () {
  },
  goPark() {
    wx.switchTab({
      url: '../garage/garage'
    })
  },
  getOrderByStatus(){
    wx.request({
      url: app.globalData.apiHost + '/api/getOrderByStatus?status=0',
      success: function(res){
        var order = res.data.data
        if(order!=null){
          wx.navigateTo({
            url: '../order/order?orderId=' + order.orderId + '&garageId=' + order.garageId
          })
        }else{
          wx.showToast({
            title: '暂无停车记录！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  onShow: function (options){

  }
})
