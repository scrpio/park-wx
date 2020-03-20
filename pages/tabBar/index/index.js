const app = getApp()
Page({
  data: {
  },
  onLoad: function () {
  },
  goPark() {
    wx.switchTab({
      url: '../garage/garage'
    })
  },
  getOrderByStatus(){
    var member = wx.getStorageSync('member')
    wx.request({
      url: app.globalData.apiHost + '/api/getOrderByStatus?memberId=' + member.id,
      success: function(res){
        var order = res.data.data
        if(order!=null){
          wx.navigateTo({
            url: '../../park/order/order?orderId=' + order.orderId + '&garageId=' + order.garageId
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
