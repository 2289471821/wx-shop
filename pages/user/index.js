// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 被收藏的商品数量
    collectNumber: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的用户数据信息
    const userInfo = wx.getStorageSync("userInfo")
    // 获取缓存中的收藏的商品数据
    const collect = wx.getStorageSync("collect") || []
    this.setData({ 
      userInfo,
      collectNumber: collect.length
    })
  },

  handleGetUserInfo(e) {
    const { userInfo } = e.detail
    wx.setStorageSync('userInfo', userInfo)
    this.setData({ userInfo })
  }
})