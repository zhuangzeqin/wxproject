//request.js 作为真正发送网络请求的文件
import {
  baseUrl
} from './publicData'
export default function reqeust(params) {
  console.log("请求的地址：" + baseUrl + params.url)
  console.log("请求的参数：" + JSON.stringify(params.data ? '{}' : params.data))
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + params.url,
      method: params.method || 'get',
      data: params.data || {},
      success: (res) => {
        const code = res.statusCode //状态码200 代表成功
        console.log("请求的状态码：" + code)
        if (code == 200) {
          console.log("请求的成功：" + JSON.stringify(res.data))
          resolve(res.data)
        } else {
          console.log("请求的失败：" + err.errMsg)
          reject(err.errMsg)
        }
      },
      fail: (err) => {
        console.log("请求的失败：" + err.errMsg)
        reject(err.errMsg)
      }
    })
  })
}