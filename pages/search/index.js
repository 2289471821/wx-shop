import { request } from '../../request/index.js'
// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索的数据
    searchData: [],
    // 取消按钮的显示与隐藏
    isFocus: false,
    // 输入框的值
    inputValue: ''
  },
  TimeId: null,

  // 输入框输入事件
  handleSearch(e) {
    clearTimeout(this.TimeId)
    // 获取输入框的值
    const { value } = e.detail
    // 检验合法性
    if(!value.trim()) {
      this.setData({
        searchData: [],
        isFocus: false
      })
      return
    }
    // 显示取消按钮
    this.setData({ isFocus: true })
    // 函数防抖
    this.TimeId = setTimeout(() => {
      this.getSearchData(value)
    }, 1000)
  },

  // 点击取消按钮事件
  handleCancle() {
    this.setData({
      searchData: [],
      isFocus: false,
      inputValue: ''
    })
  },

  // 发送请求，获取搜索数据
  async getSearchData(query) {
    const res = await request({ url: '/goods/qsearch', data: {query} })
    this.setData({ searchData: res.data.message })
  }
})