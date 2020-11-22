import { request } from '../../request/index.js';
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的菜单数据
    rightContent: [],
    // 左侧被选中的索引
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的位置
    scrollTop: 0
  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates")
    // 判断本地存储中有没有旧的数据
    if(!Cates) {
      // 本地没有数据，发送异步请求获取数据
      this.getCategoriesList()
    }else {
      // 有旧数据,再判断时间有没有过期
      if(Date.now() - Cates.time > 1000*10) {
        // 时间过期，重新请求数据
        this.getCategoriesList()
      }else {
        // 时间没过期，使用旧数据
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({ leftMenuList, rightContent })        
      }
    }
  },

  // 获取分类数据
  async getCategoriesList() {
    const { data: res } = await request({
      url: '/categories',
      method: 'GET'
    })
    this.Cates = res.message

    // 把数据存入本地存储中
    wx.setStorageSync("cates", {time: Date.now(), data: this.Cates});

    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({ leftMenuList, rightContent })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})