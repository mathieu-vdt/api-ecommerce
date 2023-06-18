const express = require('express')
const { getAll ,getOrderByUser, changeStatus ,addOrder,createOrder ,addProductInOrder ,modif ,del } = require('../controller/order')
const tokenVerif = require('../middleware/tokenVerif')

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOrderByUser)
router.post('/add/order', tokenVerif, addOrder)
router.post('/create_order', createOrder)
router.post('/change_status', changeStatus)
router.post('/add/productorder', tokenVerif, addProductInOrder)
router.put('/:id', tokenVerif, modif)
router.delete('/:id', tokenVerif, del)


module.exports = router