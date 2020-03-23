const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'a0',
    scrollTop: 0,
    scrollH: 1100,
    selectText: '全部',
    select: false,
    dataList: null,
    billList: null,
    incomeList: null,
    outlayList: null,
    income: 0,
    outlay: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var member = wx.getStorageSync('member')
    wx.request({
      url: app.globalData.apiHost + '/api/getBillList?memberId=' + member.id,
      success: function (res) {
        var list = res.data.data
        var a = 0
        var b = 0
        var incomeList = []
        var outlayList = []
        for(var i = 0; i < list.length; i++){
          if(list[i].money > 0){
            a = list[i].money + a
            incomeList.push(list[i])
          } else {
            b = list[i].money + b
            outlayList.push(list[i])
          }
        }
        that.setData({
          dataList: list,
          billList: list,
          incomeList: incomeList,
          outlayList: outlayList,
          income: a,
          outlay: b
        })
      }
    })
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      selectText: name,
      select: false
    })
    if(name == '收入'){
      this.setData({
        dataList: this.data.incomeList
      })
    }else if(name == '支出'){
      this.setData({
        dataList: this.data.outlayList
      })
    } else{
      this.setData({
        dataList: this.data.billList
      })
    }
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