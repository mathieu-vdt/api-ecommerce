const express = require('express')
const { modifQuantity, addCart, addCartItem,removeCartItem, getCartByUser,getCartIdByUser, getAll } = require('../controller/cart')
const tokenVerif = require('../middleware/tokenVerif')

const router = express.Router()

router.get('/', getAll)
router.get('/:user_id', getCartByUser)
router.get('/cart_id/:user_id', getCartIdByUser)
router.post('/add/cart_item', addCartItem)
router.post('/remove_item', removeCartItem)
router.post('/add/cart', addCart)
router.put('/:id', modifQuantity)



module.exports = router