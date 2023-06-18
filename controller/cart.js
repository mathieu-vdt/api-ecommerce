const model = require('../model/cart')


const getAll = async (req, res) => {

    const results = await model.getAll()
    res.status(200).json(results)
}

const getCartByUser = async (req, res) => {
    const result = await model.getCartByUser(req.params.user_id)
    res.status(200).json(result)
}

const getCartIdByUser = async (req, res) => {
    const result = await model.getCartIdByUser(req.params.user_id)
    res.status(200).json(result)
}

const addCartItem = async (req, res) => {
    const result = await model.addCartItem(req.body.cart_id, req.body.product_id, req.body.quantity)
    res.status(200).json(result)
}

const removeCartItem = async (req, res) => {
    const result = await model.removeCartItem(req.body.cart_id, req.body.product_id)
    res.status(200).json(result)
}


const addCart = async (req, res) => {

    const result = await model.addCart(req.body.user_id)
    res.status(200).json(result.lastID)
}

const modifQuantity = async (req, res) => {

    const result = await model.modifQuantity(req.body.order_id, req.body.product_id, req.body.quantity)
    res.status(200).json(result.lastID)
}


module.exports = {
    removeCartItem,
    modifQuantity,
    addCart, 
    addCartItem,
    getCartByUser,
    getCartIdByUser,
    getAll
}