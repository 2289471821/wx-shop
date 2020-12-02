import { request } from '../../request/index.js'

//Page Object
Page({
  data: {
    // 轮播图数组数据
    swiperList: [],
    // 分类导航数组数据
    catesList: [],
    // 楼层数组数据
    floorList: []
  },
  //options(Object)
  onLoad: function(options){
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },

  // 获取轮播图数据
  async getSwiperList() {
    // 发送异步请求获取轮播图数据
    const { data: res } = await request({
      url: '/home/swiperdata',
      method: 'GET'
    })
    const swiperList = res.message
    swiperList.map(v => {
      v.navigator_url = v.navigator_url.replace('main', 'index')
    })
    this.setData({ swiperList })
  },

  // 获取分类导航数据
  async getCatesList() {
    const { data: res } = await request({
      url: '/home/catitems',
      method: 'GET'
    })
    this.setData({
      catesList: res.message
    })
  },

  // 获取楼层数据
  async getFloorList() {
    const { data: res } = await request({
      url: '/home/floordata',
      method: 'GET'
    })
    this.setData({
      floorList: res.message
    })
  }
});