/**
 * 1 发送请求获取数据
 * 2 点击轮播图，放大预览
 *    1 给轮播图绑定点击事件
 *    2 调用小程序的API previewImage
 * 3 点击 加入购物车
 *    1 先绑定点击事件
 *    2 获取缓存中的购物车数据
 *    3 先判断 当前商品是否已经存在于 购物车
 *    4 已经存在 修改商品数据 执行购物车数量加一 重新把购物车数据填充会缓存中
 *    5 不存在 将商品添加到购物车数组中
 *    6 弹出提示
 */

import { request } from '../../request/index.js'
// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  GoodsInfo: [],

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages();
    const { goods_id } = pages[pages.length-1].options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const { data: res } = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = res.message

    // 获取缓存中的商品收藏数组数据
    const collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)

    this.setData({ 
      goodsObj: {
        goods_name: res.message.goods_name,
        goods_price: res.message.goods_price,
        goods_introduce: res.message.goods_introduce,
        pics: res.message.pics,
      },
      isCollect
    })
  },

  // 点击轮播图，放大预览
  handlePrevewImage(e) {
    // 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接受传递过来的图片地址
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },

  // 加入购物车功能
  handleCartAdd() {
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []
    // 判断当前商品是否已经存在于购物车数组中
    let index = cart.findIndex(item => item.goods_id === this.GoodsInfo.goods_id)
    if(index === -1) {
      // 不存在 将商品添加到购物车数组中
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    }else {
      // 已经存在 修改商品数据
      cart[index].num++
    }
    // 把购物车数据填充会缓存中
    wx.setStorageSync("cart", cart)
    // 弹出提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: false
    })
  },

  // 点击商品收藏或取消收藏
  handleCollect() {
    let isCollect = false
    // 获取缓存中的商品收藏数组数据
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if(index!==-1) {
      // 商品已被收藏，点击，取消收藏
      collect.splice(index, 1)
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    }else {
      // 商品未被收藏，点击收藏
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 把收藏数据重新存入缓存中
    wx.setStorageSync('collect', collect)
    this.setData({ isCollect })
  }
})
