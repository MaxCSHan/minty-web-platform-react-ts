const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.send('This is Minty Spaces Mock API.')
})



module.exports = router
