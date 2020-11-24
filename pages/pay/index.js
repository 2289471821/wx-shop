import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNumber: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的地址数据
    const address = wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []
    // 过滤后的购物车数据
    cart = cart.filter(v => v.checked)

    let totalPrice = 0, totalNumber = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNumber += v.num
    })
    this.setData({ address, cart, totalPrice, totalNumber })
  },

  // 点击支付
  handleOrderPay() {
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token")
    // 不存在token
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 存在token
    
  }
})
