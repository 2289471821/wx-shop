import { chooseImage, showToast } from '../../utils/asyncWx.js'
// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      { id: 0, value: '体验问题', isActive: true },
      { id: 1, value: '商品、商家投诉', isActive: false }
    ],
    // 被选中的图片路径数组
    chooseImgs: [],
    // 文本域的值
    textValue: ''
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],

  // 标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.map((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  },

  // 点击 '+'，选择图片事件
  async handleChooseImg() {
    try {
      const res = await chooseImage()
      this.setData({
        chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
      })
    }catch(error) {
      console.log(error)
    }
  },

  // 删除图片
  handleRemoveImg(e) {
    // 获取被点击图片的索引
    const { index } = e.currentTarget.dataset
    // 获取所有图片数组数据
    const { chooseImgs } = this.data
    // 删除图片
    chooseImgs.splice(index, 1)
    this.setData({ chooseImgs })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textValue: e.detail.value
    })
  },

  // 提交按钮的点击事件
  async handleFormSubmit() {
    // 获取文本域的内容
    const { textValue, chooseImgs } = this.data
    // 合法性的校验
    if(!textValue.trim()) {
      await showToast({ title: '输入不合法' })
      return
    }
    // 显示准备上传图片
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 判断有没有需要上传的数组
    if(chooseImgs != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件路径
          filePath: v,
          // 上传的文件名称
          name: 'image',
          // 顺带的文本信息
          formData: {},
          success: result => {
            let { data: res } = JSON.parse(result.data)
            this.UpLoadImgs.push(res.url)

            // 所有图片上传完成，触发此事件
            if(i === chooseImgs.length-1) {
              console.log('把文本域中的内容和外网的图片数组提交到后台中')
              // 重置页面
              this.setData({
                chooseImgs: [],
                textValue: ''
              })
              wx.hideLoading()
            }
          }
        })
      })
    }else {
      console.log('只提交文本')
      wx.hideLoading()
    }
  }
})