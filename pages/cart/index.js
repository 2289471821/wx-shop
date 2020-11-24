/**
 * 1 获取用户的收货地址
 *    1 点击绑定事件
 *    2 调用小程序内置API 获取用户的收货地址 wx.chooseAddress
 *    内置api点击取消按钮后，再次点击收货地址按钮无效
 * 
 *    2 获取用户对小程序所授予获取地址的权限状态 scope
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNumber: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的地址数据
    const address = wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || []
    // // 判断是否全选
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    // // 商品的总价格
    // let totalPrice = cart.filter(v => v.checked).reduce((prev, curr) => {
    //   return prev + curr.num * curr.goods_price
    // }, 0)
    // // 商品总数量
    // let totalNumber = cart.filter(v => v.checked).reduce((prev, curr) => {
    //   return prev + curr.num
    // }, 0)

    this.setCart(cart)
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
  },

  // 点击复选框，判断商品是否选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const { id } = e.currentTarget.dataset
    // 获取购物车数组
    const { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
  },

  // 商品的全选功能
  handleItemAllChange(){
    // 获取data中的数据
    let { cart, allChecked } = this.data
    // 修改全选状态
    allChecked = !allChecked
    // 修改购物车商品中的选中状态
    cart.forEach(v => v.checked = allChecked)
    
    this.setCart(cart)
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { id, operation } = e.currentTarget.dataset
    // 获取购物车数组
    const { cart } = this.data
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id)

    // 判断是否要执行删除
    if(cart[index].num === 1 && operation === -1) {
      // 弹窗提示是否删除
      const res = await showModal({ content: '是否要删除此商品？' })
      if(res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    }else {
      // 进行商品数量的修改
      cart[index].num += operation
      this.setCart(cart)    
    }
  },

  // 设置购物车状态，同时重新计算 全选状态，总价格，总数量
  setCart(cart) {
    let allChecked = true, totalPrice = 0, totalNumber = 0
    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.num * v.goods_price
        totalNumber += v.num
      }else {
        allChecked = false
      }
    })
    // 判断购物车数组是否为空
    allChecked = cart.length != 0 ? allChecked : false

    this.setData({ cart, totalPrice, totalNumber, allChecked })
    wx.setStorageSync("cart", cart)
  },

  // 点击结算
  async handlePay() {
    // 判断是否有收获地址
    const { address, totalNumber } = this.data
    if(!address.userName) {
      await showToast({ title: '您还没有选择收货地址' })
      return
    }
    // 判断有没有商品
    if(totalNumber === 0) {
      await showToast({ title: '您还没有选择商品' })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})
