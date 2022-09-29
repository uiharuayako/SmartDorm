// pages/photo/photo.ts
var fileData=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: "",
    progress:"",
    imgurl:""
  },
  downImg: function () {
    var that = this;
    var img = this.data.imgurl;
    // 下载监听进度
    wx.downloadFile({
      url: img,
      header: {
        "Authorization": fileData.token.toString()
      },
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        console.log(res)
        that.setData({imgPath:res.tempFilePath})
      }
    })
  },
  saveImg(){
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imgPath,
      success: function () {
        wx.showToast({
          title: '保存图片成功!~',
        });
      },
      fail: function () {
        wx.showToast({
          title: '保存图片失败!~',
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const imgurl="http://" + fileData.mainUrl.toString() + "/api/camera_proxy/camera.camera_minorstream?token=3ba7342980513f4bc63d5018eb8275455fbedea74102b64441021ac7345ad10b"
    this.setData({imgurl:imgurl})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.downImg()
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