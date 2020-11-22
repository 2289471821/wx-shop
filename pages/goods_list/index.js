import { request } from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0,value: '综合',isActive: true },
      { id: 1,value: '销量',isActive: false },
      { id: 2,value: '价格',isActive: false }
    ],
    // 商品数据
    goodsList: []
  },
  // 请求商品列表数据的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 商品总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 1.判断还有没有下一页数据 
    if(this.totalPages <= this.QueryParams.pagenum) {
      // 没有下一页数据
      wx.showToast({ title: '没有下一页数据' });
    }else {
      // 有下一页数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 下拉刷新页面
   */
  onPullDownRefresh: function () {
    // 重置商品数据
    this.setData({
      goodsList: []
    })
    // 重置页码 pagenum
    this.QueryParams.pagenum = 1
    // 重新发送请求商品数据
    this.getGoodsList()
  },

  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = JSON.parse(JSON.stringify(this.data))
    tabs.map((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  },

  // 获取商品列表数据
  async getGoodsList() {
    const { data: res } = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 获取总条数
    const total = res.message.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 上拉加载下一页数据，拼接返回的数组数据
      goodsList: [...this.data.goodsList, ...res.message.goods]
    })

    // 关闭下拉刷新等待效果
    wx.stopPullDownRefresh()
  }
})