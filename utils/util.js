var RSA = require("./wx_rsa.js"); //引进RSA加密js
import getMD5 from "md5.js";
/**
 * 时间格式化  fmt为格式 如：yyyy-MM-dd hh:mm:ss 或 YYYY-mm-dd 或 MM-dd
 */
const formatTime = (data, fmt) => {
    if (!data) {
        return ''
    }
    const date = new Date(data);
    let ret;
    if (!fmt) {
        fmt = "yyyy-MM-dd hh:mm:ss";
    }
    let opt = {
        "y+": date.getFullYear().toString(), // 年
        "M+": formatNumber((date.getMonth() + 1)), // 月
        "d+": formatNumber(date.getDate()), // 日
        "h+": formatNumber(date.getHours()), // 时
        "m+": formatNumber(date.getMinutes()), // 分
        "s+": formatNumber(date.getSeconds()) // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 所有参数按照ASCII排序（升序）加盐值再MD5
 * @param params
 * @param key
 * @returns {string}
 */
function sortASCIISign(params, key) {
    let dataArray = Object.keys(params);
    let dataArraySort = dataArray.sort(); //排序数组
    let length = dataArraySort.length;
    let msg = "";
    for (var i = 0; i < length; i++) {
        if (!isNull(params[dataArraySort[i]])) {//空字符串不要放进去
            msg = msg + dataArraySort[i] + "=" + params[dataArraySort[i]] + "&"
        }
    }
    msg = msg + "key=" + key;
    console.log("排序后的数据串：" + msg)
    let md5 = getMD5(msg);
    console.log("MD5后数据串：" + md5)
    return md5.toUpperCase();
}

/**
 *  RSA加密
 */
function rsaEncrypt(word, publicKey) {
    var publicKey = '-----BEGIN PUBLIC KEY-----' + publicKey + '-----END PUBLIC KEY-----';
    var encrypt_rsa = new RSA.JSEncrypt();
    encrypt_rsa.setPublicKey(publicKey);
    var encStr = encrypt_rsa.encrypt(word);
    return b64tohex(encStr)
}

/**
 *  RSA加密，再Base64加密
 */
function rsaEncryptBase64(word, publicKey) {
    var publicKey = '-----BEGIN PUBLIC KEY-----' + publicKey + '-----END PUBLIC KEY-----';
    var encrypt_rsa = new RSA.JSEncrypt();
    encrypt_rsa.setPublicKey(publicKey);
    var encStr = encrypt_rsa.encrypt(word);
    encStr = b64tohex(encStr);
    return base64_encode(encStr);
}

/**
 * 编码，配合encodeURIComponent使用
 * @param str
 * @returns {string}
 */
function base64_encode(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0,
        len = str.length,
        strin = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
            strin += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            strin += base64EncodeChars.charAt(c1 >> 2);
            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
            strin += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
}

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";

function int2char(n) {
    return BI_RM.charAt(n);
}

function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        } else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        } else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        } else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}
function formatMobile(mobile){
  var str = mobile.substr(0, 3) + "****" + mobile.substr(7);
  return str
}
/**
 * 校验输入框只能输入数值
 * @param e
 */
const formatNum = e => {
    e.detail.value = e.detail.value.replace(/^(\-)*(\d+)\.(\d{6}).*$/, '$1$2.$3')
    e.detail.value = e.detail.value.replace(/[\u4e00-\u9fa5]+/g, ""); //清除汉字
    e.detail.value = e.detail.value.replace(/[^\d.]/g, ""); //清楚非数字和小数点
    e.detail.value = e.detail.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
    e.detail.value = e.detail.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只保留第一个小数点, 清除多余的
};
/**
 * 判断是否为空值
 * @param value
 * @returns {boolean}
 */
const isNull = value => {
    if (!value || null == value || 'null' == value ||
        value == '' || value == 'undefined' ||
        typeof(value) == undefined ||
        value.length == 0) {
        return true;
    }
    return false;
};
/**
 *  只允许输入纯数字
 */
const validateNumber = val => {
    return val.replace(/\D/g, '')
}

/**
 * 防止快速点击，跳转多次的问题
 */
var lastClickTime = 0;
function quickClick() {
  let timestamp = new Date().getTime();
  console.log("timestamp=" + timestamp);
  if (timestamp - lastClickTime > 300) {
    lastClickTime = timestamp;
    console.log("if lastClickTime=" + timestamp);
    return false;
  } else {
    lastClickTime = timestamp;
    console.log("大佬! 你这么快，师从哪派？ lastClickTime=" + timestamp);
    return true;
  }
};

/**
 * 去掉字符串头尾空格
 */
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 身份证号验证
 */
function checkIdCard(idCard) {
  idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格                                          
  if (idCard.length == 15) {
    return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证    
  } else if (idCard.length == 18) {
    var a_idCard = idCard.split(""); // 得到身份证数组   
    if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**  
 * 判断身份证号码为18位时最后的验证位是否正确  
 * @param a_idCard 身份证号码数组  
 * @return  
 */
function isTrueValidateCodeBy18IdCard(a_idCard) {
  var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
  var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  var sum = 0; // 声明加权求和变量   
  if (a_idCard[17].toLowerCase() == 'x') {
    a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
  }
  for (var i = 0; i < 17; i++) {
    sum += Wi[i] * a_idCard[i]; // 加权求和   
  }
  var valCodePosition = sum % 11; // 得到验证码所位置   
  if (a_idCard[17] == ValideCode[valCodePosition]) {
    return true;
  } else {
    return false;
  }
}

/**  
 * 验证18位数身份证号码中的生日是否是有效生日  
 * @param idCard 18位书身份证字符串  
 * @return  
 */
function isValidityBrithBy18IdCard(idCard18) {
  var year = idCard18.substring(6, 10);
  var month = idCard18.substring(10, 12);
  var day = idCard18.substring(12, 14);
  var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
  // 这里用getFullYear()获取年份，避免千年虫问题   
  if (temp_date.getFullYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)) {
    return false;
  } else {
    return true;
  }
}

/**  
 * 验证15位数身份证号码中的生日是否是有效生日  
 * @param idCard15 15位书身份证字符串  
 * @return  
 */
function isValidityBrithBy15IdCard(idCard15) {
  var year = idCard15.substring(6, 8);
  var month = idCard15.substring(8, 10);
  var day = idCard15.substring(10, 12);
  var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
  // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
  if (temp_date.getYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)) {
    return false;
  } else {
    return true;
  }
}


//------提示框----------------
export const showT = (err) => {
  wx.showToast({
    title: err,
    icon: 'none',
    duration: 2000
  })
}



module.exports = {
    formatTime: formatTime,
    rsaEncrypt: rsaEncrypt,
    rsaEncryptBase64: rsaEncryptBase64,
    formatNum: formatNum,
    sortASCIISign: sortASCIISign,
    isNull: isNull,
    validateNumber: validateNumber,
    formatMobile: formatMobile,
    quickClick: quickClick,
    showT:showT,
    checkIdCard: checkIdCard
};