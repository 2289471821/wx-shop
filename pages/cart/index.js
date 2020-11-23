/**
 * 1 获取用户的收货地址
 *    1 点击绑定事件
 *    2 调用小程序内置API 获取用户的收货地址 wx.chooseAddress
 *    内置api点击取消按钮后，再次点击收货地址按钮无效
 * 
 *    2 获取用户对小程序所授予获取地址的权限状态 scope
 */

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js"

Page({
  data: {
    address: {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的地址数据
    const address = wx.getStorageSync("address");
    this.setData({ address })
  },

  // 点击收货地址按钮事件
  async handleChooseAddress() {
    // // 调用内置api，获取用户的收货地址
    // wx.chooseAddress({
    //   success: (result)=>{
    //     console.log(result);
    //   }
    // })

    // wx.getSetting({
    //   success: (result)=>{
    //     const scopeAddress = result.authSetting['scope.address']
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         }
    //       })
    //     }else {
    //       wx.openSetting({
    //         success: (result2)=>{
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       });
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });

    try {
      // 获取 权限状态
      const result = await getSetting()
      const scopeAddress = result.authSetting['scope.address']
      // 判断 权限状态
      if(scopeAddress === false) {
        // 引导用户打开授权页面
        await openSetting()
      }
      // 调用获取收货地址的 api 
      const address = await chooseAddress()
      address.detailAddress = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 将获取的地址存入到缓存中
      wx.setStorageSync("address", address)
    } catch (error) {
      console.log(error)
    }
  }


})
