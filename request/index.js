// 同时发送异步代码的次数
let ajaxTimes = 0

export const request = params => {
  // 判断 url 中是否带有 /my/ 
  let header = { ...params.header }
  if(params['url'].includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token');
  }

  ajaxTimes++
  // 显示加载中 效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: result => {
        resolve(result)
      },
      fail: error => {
        reject(error)
      },
      complete: () => {
        ajaxTimes--
        if(ajaxTimes === 0) {
          // 关闭加载中 效果
          wx.hideLoading()
        }
      }
    })
  })
}
