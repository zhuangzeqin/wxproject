// getIndexData.js : 向上负责调用request.js,向下负责该page页面的发送网络请求的所有函数,函数的内部存储了非公共部分的请求地址
import reqeust from '../request.js'
export const getBannerData = params => reqeust({url: '/banners', data: params});   //获取无参数
// export function getBannerData() {
//   //  return http.getRequest('/banners')
//   // return reqeust({
//   //   url: '/banners',//无参数
//   // })
// }
export const getGanHuo  = params => reqeust({url: '/data/category/GanHuo/type/Android/page/'+params[0]+'/count/'+params[1]});
//
// {
//   var urlStr = "/data/category/GanHuo/type/Android/page/0/count/10"
//   console.log("urlStr="+urlStr)
//   return reqeust({
//     //占位符
//     url:urlStr,
//   //  data: params
//   })
// }