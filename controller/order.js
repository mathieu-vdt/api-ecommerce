const model = require('../model/order')


const getAll = async (req, res) => {

    const results = await model.getAll()
    res.status(200).json(results)
}

const getOrderByUser = async (req, res) => {
    const result = await model.getOrderByUser(req.params.id)
    res.status(200).json(result)
}

const getById = async (req, res) => {
    const result = await model.getById(req.params.id)
    res.status(200).json(result)
}

const addOrder = async (req, res) => {

    const result = await model.addOrder(req.body.user_id)
    res.status(200).json(result.lastID)
}

const createOrder = async (req, res) => {
    const result = await model.createOrder(req.body.user_id, req.body.products)
    res.status(200).json(result.lastID)
}

const addProductInOrder = async (req, res) => {

    const result = await model.addProductInOrder(req.body.order_id, req.body.product_id, req.body.quantity)
    res.status(200).json(result.lastID)
}

const modif = async (req, res) => {
    const result = await model.modif(req.params.id, req.body.order_id, req.body.product_id, req.body.quantity,)
    res.status(200).json(result.changes)
}

const changeStatus = async (req, res) => {
    const result = await model.changeStatus(req.body.order_id, req.body.status)
    res.status(200).json(result.changes)
}

const del = async (req, res) => {
    const result = await model.del(req.params.id)
    res.status(200).json(result.changes)
}

module.exports = {
    changeStatus,
    getAll,
    getOrderByUser,
    getById,
    addOrder,
    createOrder,
    addProductInOrder,
    modif,
    del
}