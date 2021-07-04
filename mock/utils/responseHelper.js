
/**
* @description 建立陣列物件，可自行定義物件格式與筆數
* @export utils/responseHelper
* @param {number} [times=1] 筆數
* @param {object} fn 產生資料物件的function或資料物件
* @returns {Array}
*/
const genDatas = (times = 1, fn) => {
  // map(range(times), (n) => fn(n))
  const datas = []

  for (let i = 0; i < times; i++) {
    datas.push(fn(i))
  }

  return datas
}

/**
* @description 由陣列中隨機取得多個項目
* @export utils/responseHelper
* @param {Number} number 取得數量
* @param {Array} arr 要隨機取得多個項目的陣列
* @returns {Array}
*/
const getRandomItems = (number, arr) => {
  if (number > arr.length) {
    number = arr.length
  }
  const resArray = []
  arr.forEach((value, index) => {
    if (_getRandomNumber(2) === 0) return
    if (resArray.length >= number) return false
    resArray.push(value)
  })
  return resArray
}

/**
* @description 取得系統功能
* @export utils/responseHelper
* @returns {Array}
*/
const getSystemFunctions = () => {
  return [
    {
      pageid: 'repair001',
      functionid: 'add'
    },
    {
      pageid: 'repair001',
      functionid: 'edit'
    },
    {
      pageid: 'repair001',
      functionid: 'del'
    },
    {
      pageid: 'repair001',
      functionid: 'view'
    },
    {
      pageid: 'repair002',
      functionid: 'view'
    },
    {
      pageid: 'repair003',
      functionid: 'del'
    },
    {
      pageid: 'repair003',
      functionid: 'change'
    },
    {
      pageid: 'repair004',
      functionid: 'view'
    }
  ]
}

/**
* @description 將數字轉為指定長度字串，長度不足在前面加上0
* @export utils/responseHelper
* @param {Number} num 要轉為字串的數字
* @param {Number} length 產出字串指定長度
* @returns {String}
*/
const padStartWithZero = (num, length) => {
  return num.toString().padStart(length, '0')
}

/**
* @description 將日期轉換為 yyyy/MM/dd hh:mm:ss 格式字串
* @export utils/responseHelper
* @param {Date} date 要轉為字串的日期
* @returns {String}
*/
const convertDateToFormatString = (date) => {
  if (!date) return ''
  return `${date.getFullYear()}/${padStartWithZero(date.getMonth() + 1, 2)}/${padStartWithZero(date.getDate(), 2)} ${padStartWithZero(date.getHours(), 2)}:${padStartWithZero(date.getMinutes(), 2)}:${padStartWithZero(date.getSeconds(), 2)}`
}

// private functions
const _getRandomNumber = (x) => {
  return Math.floor(Math.random() * x)
}

module.exports = {
  genDatas,
  getRandomItems,
  getSystemFunctions,
  padStartWithZero,
  convertDateToFormatString
}
