// pages/map/map.ts
var fileData=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLatitude: 40.040417,
    userLongitude: 116.273514,
    homeLatitude: 30.800417,
    homeLongitude: 114.273514,
    key: fileData.mapKey.toString(),
    markers: <AnyArray>[]
  },
  getUserLocation(){
    let that=this
    let oldMarkers=this.data.markers
    wx.getLocation({
        type: 'wgs84',
        success(res) {
            oldMarkers.push({
              id:0,
              width:30,
              height:45,
              latitude:res.latitude,
              longitude:res.longitude
            })
            that.setData({
              markers:oldMarkers,
              userLatitude:res.latitude,
              userLongitude:res.longitude
            })
        }
    })
  },
  // 导航到家
  homeSweetHome(){
    let homePoint=JSON.stringify({
      'name':'家',
      'latitude': this.data.homeLatitude,
      'longitude': this.data.homeLongitude
    })
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + this.data.key + '&referer=' + 'LBSBBS' + '&endPoint=' + homePoint
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getUserLocation()
    let that=this
    let oldMarkers=this.data.markers
    wx.request({
      url: "http://" + fileData.mainUrl.toString() + "/api/states",
      header: {
        "Authorization": fileData.token.toString(),
        "content-type": "application/json",
      },
      success(res) {
        /* 获取坐标
        */
        //json转数组
        let rawData = JSON.parse(JSON.stringify(res.data))
        rawData.forEach((item: any) => {
          if (item.entity_id == "zone.home") {
            console.log(item.attributes)
            console.log(item)
            that.setData({
              homeLatitude:item.attributes.latitude,
              homeLongitude:item.attributes.longitude
            })
            oldMarkers.push({
              id:1,
              width:40,
              height:40,
              latitude:item.attributes.latitude,
              longitude:item.attributes.longitude,
              iconPath:"/images/房屋.png"
            })
          }
        });
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})