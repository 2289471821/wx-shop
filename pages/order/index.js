import { request } from '../../request/index.js'
// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0,value: '全部订单',isActive: true },
      { id: 1,value: '待付款',isActive: false },
      { id: 2,value: '待发货',isActive: false },
      { id: 3,value: '退款/退货',isActive: false }
    ],
    // 订单数据
    orders: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否token
    const token = wx.getStorageSync('token')
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }

    // 获取当前小程序的页面栈
    let pages = getCurrentPages();
    const { type } = pages[pages.length-1].options
    // 根据 type 来决定页面标题的选中元素
    this.changeTitleByIndex(type-1)
    // 根据 type值，请求数据
    this.getOrders(type)
  },

  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = JSON.parse(JSON.stringify(this.data))
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  },

  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.getOrders(index+1)
  },

  // 获取订单列表方法
  async getOrders(type) {
    const result = await request({ url: '/my/orders/all', data: {type} })
    this.setData({ 
      orders: result.data.message.orders.map(v => ({ 
        ...v,
        create_time_cn: (new Date(v.create_time*1000).toLocaleString())
      }))
    })
  }
})