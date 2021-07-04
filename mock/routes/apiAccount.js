const express = require('express')
const faker = require('faker')
const {
  padStartWithZero
} = require('../utils/responseHelper')

const router = express.Router()

router.post('/api/Account/Login', function (req, res) {
  console.log(req.body)
  const staffData = {
    staffsNo: `A${padStartWithZero(faker.random.number(), 6)}`,
    staffsName: faker.name.firstName(),
    staffsEnname: faker.name.lastName(),
    staffsEmail: 'abcd1234@tpisoftware.com',
    organizationno: faker.random.word(),
    suborganizationno: null,
    throrganizationno: null,
    flag: 'Y',
    staffsState: 'I',
    roleAuth: [
      {
        pageid: 'repair001',
        functionid: 'add',
        isactive: 'Y'
      },
      {
        pageid: 'repair001',
        functionid: 'edit',
        isactive: 'Y'
      },
      {
        pageid: 'repair001',
        functionid: 'view',
        isactive: 'Y'
      },
      {
        pageid: 'repair001',
        functionid: 'del',
        isactive: 'Y'
      },
      {
        pageid: 'repair002',
        functionid: 'view',
        isactive: 'Y'
      },
      {
        pageid: 'repair003',
        functionid: 'change',
        isactive: 'Y'
      },
      {
        pageid: 'repair004',
        functionid: 'view',
        isactive: 'Y'
      }
    ]
  }

  res.json({

    success: true,
    message: '成eee',
    total: 1,
    data: {
      token:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjksImlzcyIG9zdFwvdGlyY1wvcHVibGljXC9hcGlcL2dldC10b2tlbiIsImlhdCI6MTUxMzY2MDIzNiwiZXhwIjoxNTEzNjYwODM2LCJuYmYiOjE1MTM2NjAyMzYsImp0aSI6Imt6eW9wNEVObVhncEpKV2gifQ.36nuz91FIZQh4x5Bhe-3dQcbRj4jHjifWriHk-MB-h4',
      staffData: staffData
    }
  })
})

module.exports = router
