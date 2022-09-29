// pages/home/home.ts
var fileData = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sensors: <AnyArray>[],
    devices: <AnyArray>[],
    user: "梅志远"
  },
  // 添加传感器
  addSensor(bigIcon: string, smallIcon: string, infoText: string, dataText: string, id: string) {
    let oldSensors = this.data.sensors
    oldSensors.push({
      bigIcon: bigIcon,
      smallIcon: smallIcon,
      infoText: infoText,
      dataText: dataText,
      id: id
    })
    this.setData({ sensors: oldSensors })
  },
  // 添加可控制的设备
  addDevice(name: string, onPic: string, offPic: string, status: boolean, id: string, domain: string) {
    let oldDecices = this.data.devices
    let that = this
    // 获取设备信息
    if (id != "") {
      wx.request({
        url: "http://" + fileData.mainUrl.toString() + "/api/states/" + id,
        header: {
          "Authorization": fileData.token.toString(),
          "content-type": "application/json",
        },
        success(res) {
          //json转数组
          let rawData = JSON.parse(JSON.stringify(res.data))
          let trueState: boolean
          if (rawData.state == "on") {
            console.log("onon")
            trueState = true
          } else {
            trueState = false
          }
          oldDecices.push({
            name: name,
            pic: trueState ? onPic : offPic,
            onPic: onPic,
            offPic: offPic,
            status: trueState,
            statusText: trueState ? "开启" : "关闭",
            id: id,
            domain: domain
          })
          that.setData({ devices: oldDecices })
        }
      })
    } else {
      oldDecices.push({
        name: name,
        pic: status ? onPic : offPic,
        onPic: onPic,
        offPic: offPic,
        status: status,
        statusText: status ? "开启" : "关闭",
        id: id,
        domain: domain
      })
      this.setData({ devices: oldDecices })
    }
  },
  takeAPhoto() {
    console.log("daole")
    wx.navigateTo({ url: "../photo/photo" })
  },
  toggle(e: any) {
    let index = e.currentTarget.dataset.index
    let oldDecices = this.data.devices
    let item = oldDecices[index]
    let id = item.id
    console.log(item)
    let requestToggle = !item.status ? "off" : "on"
    oldDecices[index].status = !item.status
    oldDecices[index].statusText = !item.status ? "开启" : "关闭"
    oldDecices[index].pic = !item.status ? item.onPic : item.offPic
    this.setData({ devices: oldDecices })
    // 当id不为空，发送请求以控制家具
    if (id != "") {
      wx.request({
        url: "http://" + fileData.mainUrl.toString() + "/api/services/" + item.domain + "/turn_" + requestToggle,
        method: "POST",
        header: {
          "Authorization": fileData.token.toString(),
          "content-type": "application/json",
        },
        data: { "entity_id": item.id },
        success(res) {
          console.log("开关状态切换成功")
        }
      })
    }
  },
  refreshInfos() {
    let that = this
    wx.request({
      url: "http://" + fileData.mainUrl.toString() + "/api/states",
      header: {
        "Authorization": fileData.token.toString(),
        "content-type": "application/json",
      },
      success(res) {
        /* 获取信息
        sensor.t2_cloud_ec5o01_temperature 温度
        sensor.t2_cloud_ec5o01_humidity 湿度
        zone.home 家庭信息
        weather.forecast_wo_de_jia 天气预报
        */
        //json转数组
        let rawData = JSON.parse(JSON.stringify(res.data))
        rawData.forEach((item: any) => {
          if (item.entity_id == that.data.sensors[0].id) {
            that.setData({ ['sensors[0].dataText']: item.state.toString() + "°C" })
          }
          if (item.entity_id == that.data.sensors[1].id) {
            that.setData({ ['sensors[1].dataText']: item.state.toString() + "％" })
          }
          if (item.entity_id == that.data.sensors[2].id) {
            that.setData({ ['sensors[2].dataText']: item.state.toString() + "(0昏暗1明亮)" })
          }
          if (item.entity_id == that.data.sensors[3].id) {
            that.setData({ ['sensors[3].dataText']: item.state.toString() })
          }
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.addSensor('/images/温度传感器.png', '/images/温度.png', '当前温度', '0°C', "sensor.t2_cloud_ec5o01_temperature")
    this.addSensor('/images/湿度传感器.png', '/images/湿度.png', '当前湿度', '0%', "sensor.t2_cloud_ec5o01_humidity")
    this.addSensor('/images/光照度传感器.png', '/images/光照.png', '当前照度', '1 lx', "sensor.bmgl01_event_s4lg00_motion_illumination")
    this.addSensor('/images/暴雨.png', '/images/雨.png', '当前天气', '未下雨', "weather.forecast_wo_de_jia")
    this.addDevice('台灯', '/images/灯.png', '/images/关灯.png', false, "switch.cuco_v3_0cf8_switch", "switch")
    this.addDevice('空调', '/images/空调.png', '/images/空调关闭.png', false, "climate.miotir_cloud_825280", "climate")
    this.refreshInfos()
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