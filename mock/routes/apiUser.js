const express = require('express')
const router = express.Router()
const faker = require('faker')
const { genDatas, padStartWithZero, convertDateToFormatString } = require('../utils/responseHelper')

router.get('/user', function (req, res) {
  res.json({
    success: true,
    message: '成功',
    total: 390,
    data: [
      {
        staffsNo: '08675363',
        staffsName: '果核數位管理員',
        staffsEnname: 'admin',
        organizationNo: '1',
        organizationName: '(測試)昕力資訊股份有限公司',
        suborganizationNo: null,
        suborganizationName: null,
        flag: 'Y',
        roleData: [{ roleNo: '99', roleName: '一般用戶' }]
      }
    ]
  })
})

module.exports = router
