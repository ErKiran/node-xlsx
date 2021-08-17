const { Router } = require('express');

const { populateExcelDataToDB } = require('../controllers/order');

const router = Router()

router.post('/upload', populateExcelDataToDB)
// router.get('/filter', filterData)

module.exports = router