import { login } from '../../utils/asyncWx.js'
import { request } from '../../request/index.js'
Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 获取用户微信信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 获取小程序登录成功后的 code 值
      const { code } = await login()

      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 发送请求，获取用户的token
      // const token = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' })
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      wx.setStorageSync("token", token)
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      console.log(error)
    }
  }
})