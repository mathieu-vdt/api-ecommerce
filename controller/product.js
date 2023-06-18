const model = require('../model/product')


const getAll = async (req, res) => {

    const results = await model.getAll()
    res.status(200).json(results)
}

const getById = async (req, res) => {
    const result = await model.getById(req.params.id)
    res.status(200).json(result)
}

const getAllByUserId = async (req, res) => {
    const result = await model.getAllByUserId(req.params.user_id)
    res.status(200).json(result)
}

const add = async (req, res) => {

    const result = await model.add(req.body.nom, req.body.description, req.body.prix, req.body.photo)
    res.status(200).json(result.lastID)
}
const modif = async (req, res) => {
    const result = await model.modif(req.params.id, req.body.nom, req.body.description, req.body.prix, req.body.photo)
    res.status(200).json(result.changes)
}
const del = async (req, res) => {
    const result = await model.del(req.params.id)
    res.status(200).json(result.changes)
}

module.exports = {
    getAllByUserId,
    getAll,
    getById,
    add,
    modif,
    del
}