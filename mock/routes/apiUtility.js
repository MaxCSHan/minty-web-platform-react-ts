const express = require('express')
const router = express.Router()

router.post('/api/Utility/SendMail', function (req, res) {
  res.json({
    success: true,
    message: '成功',
    total: 0,
    data: null
  })
})

module.exports = router
