import { request } from "../../request/index.js"
import { showToast, requestPayment } from "../../utils/asyncWx.js"

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
  async handleOrderPay() {
    try{
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token")
      // 不存在token
      if(!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }
      // 存在token，创建订单
      // 准备请求头参数 authorization: token
      // const header = { Authorization: token }
      // 准备请求体参数 order_price（订单总价格），consignee_addr（收货地址），goods（订单数组）
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }

      // 发送请求，获取订单编号
      const result = await request({ url: '/my/orders/create', method: 'POST', data: orderParams })
      const { order_number } = result.data.message
      // 发起请求，获取预支付接口数据
      const res = await request({ url: '/my/orders/req_unifiedorder', method: 'POST', data: {order_number} })
      const { pay } = res.data.message
      
      // 发起微信支付
      await requestPayment(pay)
      // 显示支付状态
      await showToast({ title: '支付成功'})
    } catch(error) {
      console.log(error)
      await showToast({ title: '支付失败'})
    }
  }
})
