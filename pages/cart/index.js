/**
 * 1 获取用户的收货地址
 *    1 点击绑定事件
 *    2 调用小程序内置API 获取用户的收货地址 wx.chooseAddress
 *    2 
 */

// pages/cart/index.js
Page({
  // 点击按钮事件
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result)=>{
        console.log(result);
      }
    })
  }
})