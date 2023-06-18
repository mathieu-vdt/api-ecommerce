
const model = require('../model/user')
const jwt = require('jsonwebtoken');


const getAll = async (req, res) => {
    const results = await model.getAll()
    res.status(200).json(results)
}

const getByToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, 'maSuperCle');
    const results = await model.getUser(decoded.id)
    res.status(200).json(results)
}

const inscription = async (req, res) => {
    const result = await model.inscription(req.body.email, req.body.motdepasse)
    res.json(result)
}

const connexion = async (req, res) => {
    const result = await model.connexion(req.body.email, req.body.motdepasse)
    res.json(result)
}

const del = async (req, res) => {
    const result = await model.del(req.params.id)
    res.json(result)
}

const changePassword = async (req, res) => {
    const result = await model.changePassword(req.body.user_id, req.body.password)
    res.json(result)
}

module.exports = {
    changePassword,
    del,
    inscription,
    connexion,
    getAll,
    getByToken
}